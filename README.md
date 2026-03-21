# 🦞 OpenClaw MasterClass

**The most comprehensive OpenClaw learning hub** — a community-driven, multilingual documentation site covering everything from getting started to enterprise-grade deployments.

[![CI](https://github.com/tenten/openclaw-masterclass/actions/workflows/ci.yml/badge.svg)](https://github.com/tenten/openclaw-masterclass/actions/workflows/ci.yml)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://openclaw-masterclass.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Live site:** [https://openclaw-masterclass.vercel.app](https://openclaw-masterclass.vercel.app)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Local Development](#local-development)
- [Build](#build)
- [Internationalization (i18n)](#internationalization-i18n)
- [Search Configuration](#search-configuration)
- [OpenAPI Docs Workflow](#openapi-docs-workflow)
- [Vercel Deployment](#vercel-deployment)
- [Content Maintenance Guide](#content-maintenance-guide)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

OpenClaw MasterClass is a Docusaurus v3 documentation site that provides:

- **12-module MasterClass curriculum** — from foundations through enterprise-grade topics
- **Top 50 Skills directory** — curated ranking of the most useful OpenClaw skills
- **API reference docs** — auto-generated from OpenAPI specs
- **Community resources** — Reddit showcases, Discord links, learning paths
- **Multilingual support** — 5 locales with Traditional Chinese as default
- **Blog** — news, tutorials, and community highlights

The site is **not** an official OpenClaw property; it is a community-maintained learning resource.

---

## Tech Stack

| Layer            | Technology                                                                 |
| ---------------- | -------------------------------------------------------------------------- |
| Framework        | [Docusaurus v3](https://docusaurus.io/) (with `experimental_faster` mode) |
| Styling          | [Tailwind CSS v4](https://tailwindcss.com/) via PostCSS                   |
| UI Components    | [shadcn/ui](https://ui.shadcn.com/) (Radix + CVA)                        |
| Search           | [@easyops-cn/docusaurus-search-local](https://github.com/easyops-cn/docusaurus-search-local) |
| API Docs         | [docusaurus-plugin-openapi-docs](https://github.com/PaloAltoNetworks/docusaurus-openapi-docs) |
| Image Optimization | @docusaurus/plugin-ideal-image                                          |
| Deployment       | [Vercel](https://vercel.com/)                                             |
| Runtime          | Node.js 22+                                                               |

---

## Local Development

### Prerequisites

- **Node.js 22+** (check with `node -v`)
- **npm 10+** (ships with Node 22)
- Git

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/tenten/openclaw-masterclass.git
cd openclaw-masterclass

# 2. Install dependencies
npm install

# 3. Start the dev server (default locale: zh-Hant)
npm start
```

The dev server runs at `http://localhost:3000` with hot-reload enabled.

To start in a specific locale:

```bash
npm start -- --locale en
```

---

## Build

```bash
# Build all locales (zh-Hant, en, ja, zh-Hans, ko)
npm run build

# Build only the default locale (faster, good for CI)
npm run build -- --locale zh-Hant

# Preview the production build locally
npm run serve
```

The output is written to the `build/` directory.

---

## Internationalization (i18n)

The site supports **5 locales**:

| Locale    | Label    | Status  |
| --------- | -------- | ------- |
| `zh-Hant` | 繁體中文 | Default |
| `en`      | English  |         |
| `ja`      | 日本語   |         |
| `zh-Hans` | 简体中文 |         |
| `ko`      | 한국어   |         |

### Adding / updating translations

1. **Extract translatable strings** into JSON files:

   ```bash
   npm run write-translations -- --locale <locale>
   ```

   This generates files under `i18n/<locale>/`.

2. **Translate content docs** by placing translated Markdown files in:

   ```
   i18n/<locale>/docusaurus-plugin-content-docs/current/
   ```

3. **Translate blog posts** by placing them in:

   ```
   i18n/<locale>/docusaurus-plugin-content-blog/
   ```

4. **Translate theme strings** (navbar, footer, etc.) by editing:

   ```
   i18n/<locale>/docusaurus-theme-classic/*.json
   ```

5. **Test a specific locale** locally:

   ```bash
   npm start -- --locale ja
   ```

Refer to the [Docusaurus i18n guide](https://docusaurus.io/docs/i18n/tutorial) for full details.

---

## Search Configuration

Full-text local search is provided by `@easyops-cn/docusaurus-search-local`. Configuration lives in `docusaurus.config.js` under `themes`:

- Indexes both docs (`/docs`) and blog (`/blog`)
- Supports English and Chinese tokenization (`language: ['en', 'zh']`)
- Hashed index files for cache-busting
- Keyboard shortcut enabled (Ctrl/Cmd+K)
- Results limited to 8 items with 50-character context snippets

No external search service or API key is required.

---

## OpenAPI Docs Workflow

API reference pages are auto-generated from OpenAPI spec files using `docusaurus-plugin-openapi-docs`.

### Spec location

```
openapi/openclaw-gateway.yaml
```

### Generate API docs

```bash
# Generate MDX pages from the spec
npm run gen-api-docs openclaw_gateway

# Clean generated pages (before regenerating)
npm run clean-api-docs openclaw_gateway
```

Generated MDX files are written to `docs/architecture/api-generated/` and appear in the sidebar automatically.

### Workflow for updating API docs

1. Update (or replace) the OpenAPI spec at `openapi/openclaw-gateway.yaml`.
2. Run `npm run clean-api-docs openclaw_gateway` to remove stale pages.
3. Run `npm run gen-api-docs openclaw_gateway` to regenerate.
4. Verify locally with `npm start`, then commit all changes.

The theme `docusaurus-theme-openapi-docs` provides the `ApiItem` component, interactive "Try it" panels, and language tabs (curl, Python, Node.js, Go).

---

## Vercel Deployment

### Configuration

The project includes a `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "framework": "docusaurus-2"
}
```

### Custom domain

The production URL is `https://openclaw-masterclass.vercel.app`. To add a custom domain, configure it in the Vercel dashboard under **Settings > Domains** and update the `url` field in `docusaurus.config.js`.

### Preview deployments

Every pull request automatically gets a unique preview URL from Vercel. Use these to review changes before merging to `main`.

### Environment

No environment variables are required for the build. The site is fully static.

---

## Content Maintenance Guide

### Adding a new doc page

1. Create a Markdown or MDX file under the appropriate `docs/` subdirectory:
   ```
   docs/masterclass/module-XX-topic.md
   ```
2. Include frontmatter:
   ```yaml
   ---
   sidebar_position: 1
   title: "Your Page Title"
   description: "A short description for SEO."
   ---
   ```
3. The page appears in the sidebar automatically (autogenerated sidebars) or can be referenced in `sidebars.js`.

### Adding a blog post

1. Create a file in `blog/` following the naming convention:
   ```
   blog/YYYY-MM-DD-slug/index.md
   ```
2. Include frontmatter:
   ```yaml
   ---
   title: "Post Title"
   authors: [your-name]
   tags: [openclaw, tutorial]
   ---
   ```
3. Add a `<!-- truncate -->` marker to control the excerpt shown on the blog listing page.

### Updating the Top 50 Skills

Edit or add files under `docs/top-50-skills/`. Each skill should follow the existing template with metadata (rank, category, use case, setup instructions).

### Updating the MasterClass modules

Module docs live under `docs/masterclass/`. Each module file (`module-01-foundations.md`, etc.) corresponds to a navbar dropdown entry. Update content directly, and the navbar links in `docusaurus.config.js` if you add new modules.

### Adding images

Place images in `static/img/` and reference them with absolute paths (`/img/my-image.png`) in Markdown. For optimized images, use the `@docusaurus/plugin-ideal-image` component.

---

## Contributing

We welcome contributions from the community. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before getting started.

### How to contribute

1. **Fork** the repository.
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** — docs, code, translations, or bug fixes.
4. **Test locally:**
   ```bash
   npm start
   npm run build -- --locale zh-Hant
   ```
5. **Commit** with a clear message describing the change.
6. **Push** your branch and open a **Pull Request** against `main`.

### Guidelines

- Write in clear, accessible language. The default locale is Traditional Chinese (`zh-Hant`), but English content is also welcome.
- Keep doc pages focused — one concept per page.
- Add `sidebar_position` frontmatter to control ordering.
- Run `npm run build` before submitting to catch broken links or build errors.
- For translations, follow the [i18n workflow](#internationalization-i18n) above.

---

## Project Structure

```
openclaw-masterclass/
├── blog/                    # Blog posts
├── docs/                    # Documentation pages (MDX/Markdown)
│   ├── masterclass/         # 12-module MasterClass curriculum
│   ├── top-50-skills/       # Skill directory
│   ├── resources/           # Learning resources, API keys guide
│   ├── communities/         # Community links
│   ├── reddit/              # Reddit discussion hacks & showcases
│   ├── architecture/        # Architecture docs + generated API pages
│   ├── security/            # Security best practices
│   ├── getting-started/     # Installation & onboarding
│   └── whats-new/           # Changelog / release notes
├── openapi/                 # OpenAPI spec files
│   └── openclaw-gateway.yaml
├── src/
│   ├── components/          # React components (including shadcn/ui)
│   ├── css/                 # Tailwind CSS v4 + custom styles
│   ├── lib/                 # Utility functions
│   ├── pages/               # Standalone pages (homepage, etc.)
│   ├── plugins/             # Custom Docusaurus plugins
│   └── theme/               # Theme overrides (swizzled components)
├── static/                  # Static assets (images, favicon)
├── i18n/                    # Translation files (per locale)
├── docusaurus.config.js     # Main Docusaurus configuration
├── sidebars.js              # Sidebar structure
├── vercel.json              # Vercel deployment config
├── postcss.config.js        # PostCSS config (Tailwind v4)
└── package.json
```

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

Copyright 2026 OpenClaw MasterClass Contributors.
