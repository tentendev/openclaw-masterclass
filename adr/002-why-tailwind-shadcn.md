# ADR-002: Why Tailwind CSS v4 + shadcn/ui for Component Styling

**Date:** 2026-02-18
**Status:** Accepted
**Deciders:** Erik, front-end contributors

## Context

Docusaurus ships with Infima, its own CSS framework. While Infima handles basic documentation styling, we need:

- Custom landing page components (HeroBanner, Features grid, LatestNews)
- Consistent design tokens across light/dark themes
- Accessible, pre-built UI primitives (avatars, buttons, cards, badges) for skill cards and community profiles
- A styling approach familiar to contributors who may not know Infima's class conventions

We evaluated three approaches:

### Alternatives Considered

**Infima only (Docusaurus default)**
- Pros: Zero additional dependencies. Works out of the box with theme switching.
- Cons: Limited component library. Custom components require writing vanilla CSS or CSS modules. No utility-class workflow. Contributor friction for anyone unfamiliar with Infima's naming conventions. No accessible component primitives.

**CSS Modules + custom design tokens**
- Pros: Scoped styles, no runtime cost, framework-agnostic.
- Cons: Verbose for responsive design. No utility-class productivity. Every new component requires a new CSS file. Difficult to maintain visual consistency without a token system we'd have to build ourselves.

**Tailwind CSS v4 + shadcn/ui**
- Pros: Utility-first workflow speeds up component development. Tailwind v4 uses CSS-native `@theme` for design tokens, replacing the old `tailwind.config.js`. shadcn/ui provides copy-paste accessible components built on Radix UI primitives. Components are owned (not a dependency), so we can modify them freely.
- Cons: Requires PostCSS integration with Docusaurus (custom plugin). Potential class conflicts with Infima. Bundle includes Tailwind's CSS reset which can clash with Docusaurus defaults.

## Decision

We adopt **Tailwind CSS v4** (`^4.1.17`) with **shadcn/ui** components for all custom UI beyond Docusaurus's core documentation chrome.

Integration approach:
- PostCSS plugin at `src/plugins/tailwind-config.js` injects Tailwind processing into the Docusaurus webpack pipeline.
- `postcss.config.js` at project root configures `@tailwindcss/postcss`.
- `src/css/custom.css` imports Tailwind layers and defines Infima CSS variable overrides for theme coherence.
- shadcn/ui components live in `src/components/ui/` and use `class-variance-authority` for variant management.
- `tailwind-merge` resolves class conflicts at runtime; `clsx` handles conditional classes.

We scope Tailwind utility classes to custom components and avoid applying them to Docusaurus's internal DOM (sidebar, doc content, navbar chrome) to prevent Infima conflicts.

## Consequences

### Positive

- Rapid component development: landing page, skill cards, scoring badges, and community profiles built in hours rather than days.
- Accessible primitives from Radix UI (via shadcn/ui): keyboard navigation, screen reader support, focus management come for free.
- Design consistency through Tailwind's theme tokens. Dark mode support via CSS `prefers-color-scheme` and Docusaurus's `data-theme` attribute.
- Contributors familiar with Tailwind (a large and growing pool) can contribute UI changes without learning Infima.
- shadcn/ui components are not a dependency; they are source code we own. No risk of upstream breaking changes.

### Negative

- Additional build complexity: PostCSS must be wired into Docusaurus's webpack config via a custom plugin. This is a one-time cost but adds a non-obvious configuration layer.
- CSS specificity conflicts between Infima and Tailwind require careful scoping. We use `@layer` declarations and avoid Tailwind's preflight reset on Infima-managed elements.
- Bundle size increases by approximately 15-25KB (gzipped) for Tailwind's generated CSS. Acceptable given that unused utilities are purged at build time.
- Two styling paradigms in the same project (Infima for docs chrome, Tailwind for custom components) can confuse new contributors. Mitigated by documenting the boundary in `CONTRIBUTING.md`.

### Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^4.1.17 | Utility CSS framework |
| `@tailwindcss/postcss` | ^4.1.17 | PostCSS integration |
| `postcss` | ^8.5.6 | CSS processing pipeline |
| `tailwind-merge` | ^3.4.0 | Runtime class conflict resolution |
| `tailwindcss-animate` | ^1.0.7 | Animation utilities for shadcn/ui |
| `class-variance-authority` | ^0.7.1 | Component variant management |
| `clsx` | ^2.1.1 | Conditional class joining |
| `@radix-ui/react-avatar` | ^1.1.11 | Accessible avatar primitive |
| `@radix-ui/react-slot` | ^1.2.4 | Polymorphic component support |
| `lucide-react` | ^0.555.0 | Icon library |
