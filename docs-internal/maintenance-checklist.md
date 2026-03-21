# Maintenance Checklist

> Last updated: 2026-03-20
> Owner: Erik (primary), content team (shared)

## Weekly Tasks

### Content Freshness

- [ ] **Check OpenClaw release notes.** Visit the official changelog and GitHub releases. If a new version shipped, assess impact on existing documentation.
  - Update `docs/whats-new/` with release summary if applicable.
  - Flag any MasterClass modules or skill pages affected by breaking changes.
  - Demote trust tier of affected "Verified" claims to "Unverified" pending re-testing.

- [ ] **Scan community channels for corrections.** Spend 15-20 minutes reviewing:
  - Discord #general and #bugs for reports of incorrect documentation.
  - r/openclaw for posts mentioning "docs are wrong" or similar.
  - GitHub Discussions for documentation-related threads.
  - Log any corrections needed as GitHub issues.

### Security

- [ ] **Run `npm audit`.** Check for vulnerabilities in dependencies.
  ```bash
  npm audit
  ```
  - **Critical/High:** Fix immediately. Run `npm audit fix` or manually update the affected package. Test build. Commit and deploy.
  - **Moderate:** Create a tracking issue. Fix within 2 weeks.
  - **Low:** Note in the tracking issue. Fix during the next dependency update cycle.

### Build Health

- [ ] **Verify the production build succeeds locally.**
  ```bash
  npm run build
  ```
  - If the build fails, investigate immediately. Common causes: broken internal links (Docusaurus warns/errors on these), MDX syntax errors, missing assets.

- [ ] **Check Vercel deployment status.** Verify the latest deployment succeeded at the Vercel dashboard. Review any build warnings.

## Biweekly Tasks

### Dependency Updates (Patch)

- [ ] **Review outdated packages.**
  ```bash
  npm outdated
  ```
  - Update patch versions for all packages.
  - Ensure all `@docusaurus/*` packages are updated together.
  - Ensure `docusaurus-plugin-openapi-docs` and `docusaurus-theme-openapi-docs` are updated together.
  - Run full build and spot-check 3-5 pages after updating.
  - Commit updated `package.json` and `package-lock.json` together.

### Link Checking

- [ ] **Run a link checker on the built site.**
  ```bash
  npm run build && npx broken-link-checker http://localhost:3000 --recursive --ordered
  ```
  Alternatively, use `docusaurus build` warnings (configured with `onBrokenLinks: 'warn'`).

  - Fix broken internal links immediately.
  - For broken external links: verify the target is actually down (not a temporary outage). If permanently dead, find a replacement or remove the link with a note.

### Search Index

- [ ] **Verify search functionality.** After any content addition:
  - Build the site.
  - Test search for a term that should appear in the new content.
  - If search results are stale, clear the build cache (`npm run clear`) and rebuild.

## Monthly Tasks

### Dependency Updates (Minor)

- [ ] **Evaluate minor version updates.** Review changelogs for all packages with available minor updates.
  - Create a branch for the update.
  - Update packages.
  - Run full build.
  - Test key pages: landing page, MasterClass module, skill page, API reference, blog.
  - Merge if all tests pass.

### Content Audit

- [ ] **Review page staleness.** For each published page, check:
  - Is the "last updated" date more than 90 days old?
  - Does the page reference an OpenClaw version that is no longer current?
  - Are all linked resources (GitHub repos, external tools) still available?
  - Update stale pages or add editorial notes.

- [ ] **Review trust tier accuracy.** Spot-check 5 "Verified" claims by re-testing on the current OpenClaw version. Demote if no longer accurate.

### Analytics Review

- [ ] **Check Vercel Analytics (if enabled) or server logs.** Identify:
  - Most visited pages (prioritize maintenance for these).
  - 404 errors (indicate broken links or missing content).
  - Search terms with no results (indicate content gaps).

### Blog

- [ ] **Publish at least 1 blog post.** Topics to draw from:
  - OpenClaw release analysis.
  - Skill spotlight (deep dive on a top skill).
  - Community interview or showcase highlight.
  - Tips and tricks compilation from Discord/Reddit.

## Quarterly Tasks

### Major Dependency Evaluation

- [ ] **Evaluate major version updates.** Check if any dependencies have new major versions.
  - Read migration guides.
  - Assess effort and risk.
  - Create tracking issue with migration plan.
  - Schedule migration for a low-activity period.

- [ ] **Docusaurus version check.** Specifically assess Docusaurus v4 readiness:
  - Review v4 changelog and migration guide.
  - Test swizzled components for compatibility.
  - Plan migration timeline.

### Research Data Refresh

- [ ] **Re-pull quantitative data for skills rankings.**
  - ClawHub 30-day download counts.
  - GitHub stars and issue counts.
  - Any new skills that should enter the Top 50.
  - Update `research/skills-ranking-data.md`.

- [ ] **Re-evaluate communities rankings.**
  - Has any community significantly changed (new moderation, official support added/removed)?
  - Update `research/communities-ranking-data.md`.

- [ ] **Refresh Reddit showcases.**
  - Scan for new high-quality showcases.
  - Remove showcases confirmed broken on current version.
  - Update `docs/reddit/top-30-showcases`.

### Security Deep Dive

- [ ] **Audit all skill security ratings.** Re-check permissions requested by each top-20 skill.
  - Have any skills added new permission requests since last review?
  - Have any security incidents been reported?
  - Update SEC scores in `research/skills-ranking-data.md` if needed.

- [ ] **Review site security.**
  - Verify no secrets are committed (API keys, tokens).
  - Check that `robots.txt` and `sitemap.xml` are appropriate.
  - Verify HTTPS is enforced on the deployed site.
  - Review Vercel project settings for any exposed environment variables.

### Localization

- [ ] **Assess translation progress.** For each active locale:
  - How many pages are translated?
  - Are translations up to date with source content changes?
  - Identify pages that changed in source but not in translation.
  - See `docs-internal/localization-plan.md` for priority order.

## Ad-Hoc Tasks (Triggered by Events)

### On New OpenClaw Major/Minor Release

1. Read release notes thoroughly.
2. Update `docs/whats-new/` with a new monthly page.
3. Identify breaking changes affecting documentation.
4. Demote trust tiers for affected claims.
5. Re-test top 10 skills for compatibility.
6. Update installation guide if system requirements changed.
7. Regenerate API docs if the Gateway spec changed (`npm run gen-api-docs`).

### On Security Incident (e.g., ClawHavoc-style event)

1. Publish a blog post with advisory and timeline.
2. Update `docs/security/best-practices.md` with lessons learned.
3. Re-audit SEC scores for affected skills.
4. Add warnings to affected skill pages.

### On Community Request for New Content

1. Log the request as a GitHub issue.
2. Assess priority against the content roadmap.
3. If high-demand (5+ independent requests), escalate to P0/P1.
4. Communicate timeline in the requesting channel.
