# ADR-004: Why @easyops-cn/docusaurus-search-local Over Algolia DocSearch

**Date:** 2026-02-22
**Status:** Accepted
**Deciders:** Erik, infrastructure lead

## Context

Full-text search is essential for a 100+ page documentation site. Users need to find specific skill names, configuration keys, error messages, and API endpoints quickly.

Docusaurus supports two primary search approaches:

### Alternatives Considered

**Algolia DocSearch**
- Pros: Best-in-class search quality. Typo tolerance, synonym support, faceted results. Free tier for open-source documentation. Hosted infrastructure with zero maintenance.
- Cons: Requires application and approval from Algolia's DocSearch program. Approval can take 2-4 weeks and is not guaranteed for community projects. Relies on Algolia's crawler to index content, introducing a delay between deployment and search availability. External dependency: if Algolia's service is down, search is unavailable. The free tier requires the site to be publicly accessible and open-source. CJK (Chinese, Japanese, Korean) tokenization requires custom configuration and is not enabled by default. Data leaves our deployment to Algolia's servers.

**@easyops-cn/docusaurus-search-local**
- Pros: Fully client-side search using a pre-built index. Zero external dependencies. Index is generated at build time and shipped as a static asset. Native CJK support via `language: ['en', 'zh']` configuration. Works immediately after deployment with no crawler delay. No application process. No data sent to third parties. Works offline.
- Cons: Search quality is lower than Algolia (no typo tolerance, no synonym support, no machine learning ranking). Index size grows with content (currently ~800KB gzipped for all locales). Initial page load includes the search index. No analytics on search queries.

**Lunr.js custom integration**
- Pros: Maximum control over indexing and ranking.
- Cons: Significant development effort to build UI, indexing pipeline, and CJK tokenization. Essentially reimplementing what `@easyops-cn/docusaurus-search-local` already provides.

## Decision

We use **`@easyops-cn/docusaurus-search-local` v0.52.1** for full-text search.

Configuration:

```js
{
  indexPages: true,
  docsRouteBasePath: '/docs',
  hashed: true,
  language: ['en', 'zh'],
  highlightSearchTermsOnTargetPage: false,
  searchResultContextMaxLength: 50,
  searchResultLimits: 8,
  searchBarShortcut: true,
  searchBarShortcutHint: true,
  indexDocs: true,
  indexBlog: true,
}
```

Key configuration choices:
- `language: ['en', 'zh']` enables CJK tokenization for our zh-Hant, zh-Hans, and partially ja content.
- `hashed: true` enables long-term caching of the search index via content hashing.
- `highlightSearchTermsOnTargetPage: false` disabled because it conflicts with our custom Tailwind styling.
- `searchResultLimits: 8` balances result density with UI cleanliness.

## Consequences

### Positive

- Zero external dependencies. Search works even if every third-party service is down.
- CJK support works out of the box. Our primary locale (zh-Hant) is fully searchable without custom configuration.
- No application process or approval wait. Search was available from day one.
- Privacy-friendly: no user search queries are sent to external services. Important for users in regions with data residency requirements.
- Search index is available immediately after deployment, with no crawler lag.
- Keyboard shortcut (Ctrl/Cmd+K) provides quick access.

### Negative

- No typo tolerance. Searching for "gihub" will not find "GitHub". Users must type accurately.
- No search analytics. We cannot see what users search for or which searches return no results. Mitigated partially by monitoring 404 pages and user feedback channels.
- Index size will grow as content expands. At 500+ pages across 5 locales, the index could reach 2-3MB. We monitor this and may need to implement index splitting per locale.
- No faceted search (filter by category, skill type, etc.). Users see a flat list of results.

### Re-evaluation Trigger

We will reconsider Algolia DocSearch if:
- The site reaches 500+ pages and local search performance degrades noticeably.
- Algolia approves our DocSearch application (submitted as a backup, pending as of March 2026).
- User feedback consistently reports search quality issues.
- We need search analytics to guide content decisions.
