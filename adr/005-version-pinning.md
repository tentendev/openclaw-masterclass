# ADR-005: Strategy for Pinning Package Versions

**Date:** 2026-02-25
**Status:** Accepted
**Deciders:** Erik, build/CI maintainers

## Context

The project depends on 20+ direct packages spanning Docusaurus core, UI libraries, search, OpenAPI tooling, and CSS processing. The Node.js ecosystem moves fast, and breaking changes in minor or patch releases are common, particularly in:

- Docusaurus plugins that depend on internal APIs
- Tailwind CSS v4 (still stabilizing its CSS-first configuration model)
- OpenAPI docs plugin (tracks Docusaurus internals closely)
- Radix UI primitives (frequent minor releases with subtle behavior changes)

We need a versioning strategy that balances stability (builds should not break from an unreviewed dependency update) with currency (staying reasonably up to date for security patches and features).

### Approaches Considered

**Exact pinning (`"3.9.2"`)**
- Pros: Maximum reproducibility. Every install produces identical `node_modules`.
- Cons: No automatic patch updates. Security patches require manual version bumps for every package. Generates noisy diffs when updating. `package-lock.json` already provides exact resolution.

**Caret ranges (`"^3.9.2"`) — npm default**
- Pros: Allows minor and patch updates automatically. Reduces manual maintenance. Community convention.
- Cons: A bad minor release can break the build without any code change. Relies on `package-lock.json` for reproducibility (which is committed).

**Tilde ranges (`"~3.9.2"`)**
- Pros: Allows only patch updates. More conservative than caret.
- Cons: Misses useful minor features. Still not fully deterministic without lock file.

## Decision

We use **caret ranges (`^`)** in `package.json` for all dependencies, combined with a **committed `package-lock.json`** and **scheduled dependency review**.

Specific policies:

### 1. Lock file is the source of truth
- `package-lock.json` is always committed. Builds use `npm ci` (not `npm install`) in CI to ensure exact reproduction.
- Local development uses `npm install`, which respects the lock file for existing packages.

### 2. Docusaurus core packages are pinned to the same minor
All `@docusaurus/*` packages use the same caret range (currently `^3.9.2`) to ensure internal compatibility:
```
@docusaurus/core: ^3.9.2
@docusaurus/preset-classic: ^3.9.2
@docusaurus/faster: ^3.9.2
@docusaurus/plugin-ideal-image: ^3.9.2
@docusaurus/remark-plugin-npm2yarn: ^3.9.2
@docusaurus/module-type-aliases: ^3.9.2
@docusaurus/types: ^3.9.2
```
When updating any Docusaurus package, all must be updated together.

### 3. OpenAPI plugin versions are paired
`docusaurus-plugin-openapi-docs` and `docusaurus-theme-openapi-docs` must always be on the same version (`^4.5.1`). They share internal contracts.

### 4. Scheduled update cadence
- **Weekly**: `npm audit` for security vulnerabilities. Patch immediately for high/critical findings.
- **Biweekly**: Review `npm outdated` output. Update patch versions.
- **Monthly**: Evaluate minor version updates. Test in a branch before merging.
- **Quarterly**: Evaluate major version updates. Create tracking issues.

### 5. Engine constraint
`package.json` specifies `"node": ">=20.0"` to ensure compatibility with the LTS release used in CI.

## Consequences

### Positive

- Builds are reproducible via `npm ci` and the committed lock file.
- Caret ranges allow `npm audit fix` to resolve vulnerabilities without manual range edits.
- Grouped Docusaurus versioning prevents subtle internal API mismatches that cause cryptic build failures.
- Scheduled cadence prevents drift without requiring constant attention.

### Negative

- Running `npm install` to add a new package can bump transitive dependencies unexpectedly. Contributors must review lock file changes.
- Caret ranges mean `npm update` can pull in minor versions that introduce regressions. Mitigated by always testing updates in a branch with a full build before merging.
- No automated dependency update tool (Dependabot, Renovate) is configured yet. This is a planned improvement (see docs-internal/content-roadmap.md).

### Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Docusaurus breaking change in minor release | CI runs full build on every PR. Lock file prevents surprise updates in CI. |
| OpenAPI plugin version mismatch | Paired version policy. CI build catches incompatibilities immediately. |
| Security vulnerability in transitive dependency | Weekly `npm audit`. Caret ranges allow `npm audit fix` to work. |
| Node.js version drift between contributors | `.nvmrc` file and `engines` field in `package.json`. CI uses the same Node version. |
