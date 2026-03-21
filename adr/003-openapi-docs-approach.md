# ADR-003: Using docusaurus-plugin-openapi-docs for API Reference

**Date:** 2026-02-20
**Status:** Accepted
**Deciders:** Erik, API documentation lead

## Context

The OpenClaw Gateway exposes a REST API that users interact with for agent management, skill orchestration, memory operations, and webhook configuration. We maintain an OpenAPI 3.1 specification at `openapi/openclaw-gateway.yaml`.

We need to provide:

- Browsable API reference with endpoint descriptions, parameter tables, and response schemas
- Interactive "try it out" panels for testing endpoints
- Code samples in multiple languages (curl, Python, Node.js, Go)
- Integration with the existing Docusaurus sidebar and search
- Automatic regeneration when the spec changes

### Alternatives Considered

**Swagger UI embedded via iframe**
- Pros: Zero integration effort. Drop Swagger UI's HTML into a static page.
- Cons: No integration with Docusaurus search, sidebar, or theming. Looks visually disconnected. Cannot customize layout or add contextual documentation around endpoints.

**Redoc standalone page**
- Pros: Beautiful three-panel layout. Supports OpenAPI 3.1.
- Cons: Same integration problems as Swagger UI. No sidebar integration, no search indexing, no MDX interleaving. Redoc is read-only (no try-it-out).

**Manual MDX pages per endpoint**
- Pros: Full control over layout and content. Deep sidebar/search integration.
- Cons: Enormous maintenance burden. Any spec change requires manual updates to dozens of MDX files. Error-prone for parameter tables and schema definitions.

**docusaurus-plugin-openapi-docs (v4.x)**
- Pros: Generates MDX pages from the OpenAPI spec. Full sidebar integration via `sidebarOptions`. Built-in code sample tabs (curl, Python, Node.js, Go via `languageTabs` config). Interactive try-it-out panels. Supports OpenAPI 3.0 and 3.1. Theme package (`docusaurus-theme-openapi-docs`) provides `@theme/ApiItem` component. Pages are regenerated via `docusaurus gen-api-docs` command.
- Cons: Generated MDX files are committed to the repo (not built on-the-fly), which creates merge noise. Customization of generated output requires theme swizzling. Package is community-maintained.

## Decision

We use **`docusaurus-plugin-openapi-docs` v4.5.1** with the companion **`docusaurus-theme-openapi-docs` v4.5.1** for API reference documentation.

Configuration:

```js
// docusaurus.config.js (plugin section)
{
  id: 'openapi',
  docsPluginId: 'classic',
  config: {
    openclaw_gateway: {
      specPath: 'openapi/openclaw-gateway.yaml',
      outputDir: 'docs/architecture/api-generated',
      sidebarOptions: {
        groupPathsBy: 'tag',
        categoryLinkSource: 'tag'
      },
    }
  }
}
```

Generated pages land in `docs/architecture/api-generated/` and are grouped by API tag (Agents, Skills, Memory, Webhooks, etc.) in the sidebar.

The `@theme/ApiItem` component is set as the `docItemComponent` for the docs preset, enabling the try-it-out panel and code sample tabs on generated pages.

### Workflow

1. Edit `openapi/openclaw-gateway.yaml` with spec changes.
2. Run `npm run gen-api-docs` to regenerate MDX pages.
3. Review generated diffs, commit alongside the spec change.
4. CI validates that generated pages match the spec (no stale generated files).

## Consequences

### Positive

- API reference stays in sync with the OpenAPI spec through a deterministic generation step.
- Full Docusaurus integration: search indexes API endpoints, sidebar groups them by tag, breadcrumbs work correctly.
- Code samples in 4 languages (curl, Python, Node.js, Go) are auto-generated from request/response schemas.
- Interactive try-it-out reduces the need for separate API testing tools during development.
- Adding a new API tag or endpoint requires only a spec edit and regeneration.

### Negative

- Generated MDX files (~50-100 files) are committed to version control. This inflates diffs when the spec changes significantly. Mitigated by using `.gitattributes` to mark generated files as `linguist-generated`.
- The generation step is manual. Forgetting to run `gen-api-docs` after a spec change leads to stale documentation. Mitigated by CI validation.
- Customizing the generated page layout requires swizzling `@theme/ApiItem`, which creates a maintenance surface for Docusaurus upgrades.
- The plugin does not yet support OpenAPI 3.1's `webhooks` top-level key. Our webhook documentation is written manually in `docs/architecture/`.

### Risks

- Plugin maintainer bandwidth: `docusaurus-plugin-openapi-docs` is maintained by a small team. If the project becomes inactive, we would need to fork. The package has consistent release cadence (monthly) as of March 2026.
- Docusaurus v4 compatibility: the plugin will need updates when we migrate. We monitor the plugin's GitHub issues for v4 tracking.
