// Route: tenten.co/openclaw/*
const UPSTREAM = 'openclaw-masterclass.vercel.app';

// Locale paths — order matters for matching
// zh-Hant is default (served at /openclaw/, no prefix)
const LOCALE_MAP = {
  'en':      '/openclaw/en/',
  'ja':      '/openclaw/ja/',
  'ko':      '/openclaw/ko/',
  'zh-Hans': '/openclaw/zh-Hans/',
  'zh-Hant': '/openclaw/',
};

// Already on a locale path — don't redirect again
const LOCALE_PREFIXES = ['/openclaw/en/', '/openclaw/ja/', '/openclaw/ko/', '/openclaw/zh-Hans/'];

/**
 * Parse Accept-Language header and return best matching locale.
 * e.g. "ja,en-US;q=0.9,en;q=0.8,zh-TW;q=0.7" → "ja"
 */
function detectLocale(acceptLanguage) {
  if (!acceptLanguage) return null;

  // Parse into sorted [lang, quality] pairs
  const langs = acceptLanguage
    .split(',')
    .map((part) => {
      const [lang, q] = part.trim().split(';q=');
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1.0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of langs) {
    // Exact or prefix matches, most specific first
    // zh-tw, zh-hant → zh-Hant (Traditional Chinese)
    if (lang === 'zh-tw' || lang === 'zh-hant' || lang.startsWith('zh-hant')) {
      return 'zh-Hant';
    }
    // zh-cn, zh-hans, zh-sg → zh-Hans (Simplified Chinese)
    if (lang === 'zh-cn' || lang === 'zh-hans' || lang === 'zh-sg' || lang.startsWith('zh-hans')) {
      return 'zh-Hans';
    }
    // Plain "zh" → default to zh-Hant (site default)
    if (lang === 'zh') {
      return 'zh-Hant';
    }
    // Japanese
    if (lang === 'ja' || lang.startsWith('ja-')) {
      return 'ja';
    }
    // Korean
    if (lang === 'ko' || lang.startsWith('ko-')) {
      return 'ko';
    }
    // English
    if (lang === 'en' || lang.startsWith('en-')) {
      return 'en';
    }
  }

  return null; // no match — use site default (zh-Hant)
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Only handle /openclaw paths
    if (!url.pathname.startsWith('/openclaw')) {
      return fetch(request);
    }

    // Redirect /openclaw (no trailing slash) to /openclaw/
    if (url.pathname === '/openclaw') {
      return Response.redirect(`${url.origin}/openclaw/`, 302);
    }

    // --- Language detection redirect ---
    // Only on the root landing page /openclaw/ (not subpages, not assets, not already on a locale)
    if (url.pathname === '/openclaw/') {
      const isAlreadyLocale = LOCALE_PREFIXES.some((p) => url.pathname.startsWith(p));
      const hasLocaleParam = url.searchParams.has('lang');
      const hasNoredir = url.searchParams.has('noredir');

      if (!isAlreadyLocale && !hasLocaleParam && !hasNoredir) {
        const acceptLang = request.headers.get('Accept-Language');
        const detected = detectLocale(acceptLang);

        // Only redirect if detected locale is NOT the default (zh-Hant)
        if (detected && detected !== 'zh-Hant' && LOCALE_MAP[detected]) {
          const redirectUrl = `${url.origin}${LOCALE_MAP[detected]}`;
          // 302 (temporary) so browsers don't permanently cache the redirect
          // Vary: Accept-Language so CDN caches per language
          return new Response(null, {
            status: 302,
            headers: {
              'Location': redirectUrl,
              'Vary': 'Accept-Language',
              'Cache-Control': 'no-cache',
            },
          });
        }
      }
    }

    // --- Proxy to Vercel ---
    const upstreamUrl = new URL(url.pathname + url.search, `https://${UPSTREAM}`);

    const headers = new Headers(request.headers);
    headers.set('Host', UPSTREAM);
    headers.set('X-Forwarded-Host', url.hostname);
    headers.set('X-Forwarded-Proto', 'https');

    const newRequest = new Request(upstreamUrl.toString(), {
      method: request.method,
      headers: headers,
      body: request.body,
      redirect: 'manual',
    });

    const response = await fetch(newRequest);

    // Handle redirects from Vercel — rewrite Location header to use our domain
    if ([301, 302, 307, 308].includes(response.status)) {
      const location = response.headers.get('Location');
      if (location) {
        const redirectUrl = new URL(location, upstreamUrl);
        if (redirectUrl.hostname === UPSTREAM) {
          redirectUrl.hostname = url.hostname;
          redirectUrl.protocol = url.protocol;
        }
        return Response.redirect(redirectUrl.toString(), response.status);
      }
    }

    // Clone response with mutable headers
    const newHeaders = new Headers(response.headers);

    // Remove Vercel-specific headers
    newHeaders.delete('x-vercel-id');
    newHeaders.delete('x-vercel-cache');
    newHeaders.delete('server');

    // Security & SEO headers
    newHeaders.set('X-Robots-Tag', 'index, follow');
    newHeaders.set('X-Frame-Options', 'SAMEORIGIN');
    newHeaders.set('X-Content-Type-Options', 'nosniff');

    // Vary by Accept-Language for CDN caching
    newHeaders.set('Vary', 'Accept-Language');

    // Cache static assets aggressively (hashed filenames = safe to cache forever)
    if (url.pathname.match(/\/assets\/(js|css)\/.*\.[a-f0-9]+\./)) {
      newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
    }

    // Cache images
    if (url.pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|webp)$/)) {
      newHeaders.set('Cache-Control', 'public, max-age=86400');
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
