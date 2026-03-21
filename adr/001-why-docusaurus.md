# ADR-001: Why Docusaurus v3 as the Documentation Framework

**Date:** 2026-02-15
**Status:** Accepted
**Deciders:** Erik, core documentation team

## Context

The OpenClaw MasterClass project needs a documentation platform capable of handling:

- 100+ pages of structured technical documentation (MasterClass modules, skills guides, API references)
- Internationalization across 5 locales (zh-Hant, en, ja, zh-Hans, ko)
- OpenAPI spec rendering for the Gateway API
- Blog functionality for release notes and community content
- Full-text search across multilingual content
- Custom React components for interactive elements (scoring tables, install commands)

We evaluated four frameworks:

### Alternatives Considered

**Next.js (App Router)**
- Pros: Maximum flexibility, excellent performance, huge ecosystem, first-class TypeScript support.
- Cons: No built-in docs primitives (sidebar, versioning, search, i18n routing). We would need to build or integrate MDX processing, sidebar generation, doc versioning, and search from scratch. Estimated 3-4 weeks of infrastructure work before writing a single doc page. The `contentlayer` ecosystem was unstable at evaluation time.

**Astro (Starlight)**
- Pros: Excellent static performance, content collections are elegant, Starlight provides good defaults for docs.
- Cons: Starlight's i18n requires manual file mirroring per locale, which scales poorly to 5 locales. The OpenAPI plugin ecosystem is immature compared to Docusaurus. Swizzling equivalent (component overrides) is less documented. Community plugin count is roughly 1/5th of Docusaurus.

**VitePress**
- Pros: Very fast dev server and build, clean defaults, Vue-based.
- Cons: Vue-only component model is a hard constraint. Our team has React expertise. No native OpenAPI integration. i18n support exists but lacks the locale-aware routing and translation extraction that Docusaurus provides. Plugin ecosystem is significantly smaller.

**Docusaurus v3**
- Pros: Purpose-built for documentation. Native MDX support, sidebar generation from filesystem, doc versioning, i18n with crowdin/manual workflows, OpenAPI plugin ecosystem (`docusaurus-plugin-openapi-docs`), search plugins, blog plugin, swizzling for deep customization. Large community and maintained by Meta.
- Cons: Heavier bundle than Astro/VitePress. Build times can be slow for large sites (mitigated by `@docusaurus/faster`). Styling opinions require effort to override.

## Decision

We chose **Docusaurus v3** (`@docusaurus/core ^3.9.2`) as the documentation framework.

Key factors in order of weight:

1. **i18n maturity**: Built-in locale routing, `write-translations` CLI, per-locale builds. Critical for our 5-locale requirement.
2. **OpenAPI integration**: `docusaurus-plugin-openapi-docs` v4.x provides spec-driven API reference pages with try-it-out panels, code samples in multiple languages, and sidebar integration. No equivalent exists for Starlight or VitePress.
3. **Ecosystem depth**: Search plugins (Algolia, easyops-cn local search), image optimization (`ideal-image`), remark/rehype plugin compatibility.
4. **React compatibility**: Our custom components (HeroBanner, Features, LatestNews, TimeStamp) are React-based. Tailwind + shadcn/ui integration works naturally.
5. **Team familiarity**: The team has shipped 3 prior Docusaurus sites.

We enable `future.experimental_faster` and `future.v4` flags to get Rust-based bundling (SWC + rspack) for improved build performance.

## Consequences

### Positive

- Full i18n pipeline out of the box; adding a new locale requires only config changes and translation files.
- OpenAPI reference pages are auto-generated from the `openapi/openclaw-gateway.yaml` spec.
- The plugin ecosystem covers search, blog, and image optimization without custom code.
- Swizzling allows deep UI customization (we swizzle Navbar, Footer, BlogLayout, and theme icons).

### Negative

- Client-side JS bundle is larger than Astro or VitePress (~180KB gzipped baseline). Acceptable for a documentation site where SEO is handled by SSG.
- Docusaurus v3 is in maintenance mode as v4 approaches. We pin to ^3.9.x and enable v4 future flags to ease migration.
- Tailwind integration requires a custom PostCSS plugin (`src/plugins/tailwind-config.js`) rather than first-class support.
- Build times for 5 locales are approximately 3-5 minutes. CI caching and `@docusaurus/faster` keep this manageable.

### Risks

- If Docusaurus v4 introduces breaking changes to swizzled components, migration effort could be significant. Mitigation: we swizzle minimally and track the v4 RFC.
- The `docusaurus-plugin-openapi-docs` package is community-maintained. If it becomes unmaintained, we would need to fork or switch to a static OpenAPI renderer. Mitigation: the package has active maintainers and 2k+ GitHub stars as of March 2026.
