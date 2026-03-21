# Localization Plan

> Last updated: 2026-03-20
> Docusaurus i18n docs: https://docusaurus.io/docs/i18n/introduction

## Locale Configuration

Configured in `docusaurus.config.js`:

```
defaultLocale: 'zh-Hant'
locales: ['zh-Hant', 'en', 'ja', 'zh-Hans', 'ko']
```

| Locale | Label | Priority | Status | Estimated Effort |
|--------|-------|:--------:|--------|:----------------:|
| zh-Hant | 繁體中文 | Default | All content authored here | N/A |
| en | English | P0 | Not started | High (full translation of all pages) |
| ja | 日本語 | P1 | Not started | High |
| zh-Hans | 简体中文 | P1 | Not started | Low (zh-Hant adaptation, mostly terminology) |
| ko | 한국어 | P2 | Not started | High |

## Strategy

### Authoring Language

All content is authored in **Traditional Chinese (zh-Hant)** as the primary locale. This reflects the core team's language and the largest initial audience.

English is the first translation priority because:
- It is the lingua franca of the OpenClaw developer community
- Most external references (GitHub, ClawHub, official docs) are in English
- It enables broader community contribution
- SEO value for international search traffic

### Translation Workflow

#### Phase 1: Manual Translation (Current)

For the initial content push (P0 pages), translations are done manually:

1. Content is written in zh-Hant in the `docs/` directory.
2. Translators create corresponding files in `i18n/{locale}/docusaurus-plugin-content-docs/current/`.
3. PR review by a native speaker of the target language.
4. Merge after review.

File structure example:
```
docs/
  getting-started/
    installation.md          ← zh-Hant (source)

i18n/
  en/
    docusaurus-plugin-content-docs/
      current/
        getting-started/
          installation.md    ← English translation
  ja/
    docusaurus-plugin-content-docs/
      current/
        getting-started/
          installation.md    ← Japanese translation
```

#### Phase 2: Assisted Translation (Q3 2026)

Once content stabilizes (P0 and P1 pages complete), we plan to:

1. Use `docusaurus write-translations` to extract UI strings.
2. Use AI-assisted translation (Claude or similar) for first drafts.
3. Native speaker review for all AI-generated translations.
4. Evaluate Crowdin integration for community-contributed translations.

#### Phase 3: Community Translation (Q4 2026)

If the community grows sufficiently:

1. Set up Crowdin or Weblate project.
2. Define translation memory and glossary.
3. Community translators can contribute via web UI.
4. Maintainers review and approve before merge.

## Priority Pages for Translation

### English (P0) — Target: Q2 2026

Translate in this order (highest traffic / most referenced first):

1. `docs/intro.md` — Site introduction
2. `docs/getting-started/installation.md` — Installation guide
3. `docs/masterclass/overview.md` — Course overview
4. `docs/top-50-skills/overview.md` — Skills ranking
5. `docs/masterclass/module-01-foundations.md` — First module
6. `docs/resources/official-links.md` — Resource directory
7. `docs/resources/learning-path.md` — Learning path
8. `docs/security/best-practices.md` — Security guide (once written)
9. Individual skill pages (top 10) — as they are written

### Japanese (P1) — Target: Q3 2026

Same page priority as English. Additional considerations:
- Japanese community has requested translated versions of MasterClass modules
- LINE integration guide is Japan-specific and should be authored directly in ja

### Simplified Chinese (P1) — Target: Q3 2026

Adaptation from zh-Hant rather than full translation:

- Convert Traditional Chinese characters to Simplified Chinese
- Adjust terminology where conventions differ (e.g., 伺服器 → 服务器, 程式 → 程序)
- Adjust region-specific references (payment methods, cloud providers popular in mainland China)
- Estimated effort: 20-30% of a full translation

### Korean (P2) — Target: Q4 2026

Depends on community volunteer availability. The OpenClaw Korea community has expressed interest in contributing translations.

## Quality Rules

### General

1. **Do not machine-translate and merge without review.** All translations must be reviewed by a native speaker before merging.
2. **Preserve technical terms in English.** Terms like "Gateway", "ClawHub", "Skill", "manifest.json" should remain in English across all locales. Wrap in backticks when used inline.
3. **Translate descriptions, not identifiers.** Command names, file paths, config keys, and code samples stay in English. Surrounding explanatory text is translated.
4. **Maintain admonition types.** `:::warning`, `:::tip`, `:::verified` etc. must use the same type in all locales. Only the content inside is translated.
5. **Keep frontmatter consistent.** `sidebar_position` and page structure must match across locales. `title` and `description` are translated.

### Terminology Glossary

Maintain a shared glossary to ensure consistency:

| English | zh-Hant | zh-Hans | ja | ko |
|---------|---------|---------|----|----|
| Skill | Skill | Skill | スキル | 스킬 |
| Gateway | Gateway | Gateway | ゲートウェイ | 게이트웨이 |
| Agent | Agent | Agent | エージェント | 에이전트 |
| Memory | 記憶系統 | 记忆系统 | メモリシステム | 메모리 시스템 |
| Install | 安裝 | 安装 | インストール | 설치 |
| Configuration | 設定 | 配置 | 設定 | 설정 |
| Manifest | Manifest | Manifest | マニフェスト | 매니페스트 |
| Permission | 權限 | 权限 | パーミッション | 권한 |
| Automation | 自動化 | 自动化 | オートメーション | 자동화 |
| Deployment | 部署 | 部署 | デプロイ | 배포 |

This glossary will be expanded as content grows and formalized into a Crowdin glossary when Phase 3 begins.

### Review Checklist

For each translated page, the reviewer confirms:

- [ ] All code blocks are unchanged (not translated)
- [ ] All links work (internal links adjusted for locale prefix if needed)
- [ ] Technical terms follow the glossary
- [ ] Admonition types are preserved
- [ ] Frontmatter `sidebar_position` matches the source
- [ ] No machine translation artifacts (unnatural phrasing, hallucinated content)
- [ ] Images with text are noted for future localization (or alt text is translated)
- [ ] Page renders correctly in local dev server (`npm start -- --locale {locale}`)
