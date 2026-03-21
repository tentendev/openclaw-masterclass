// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'OpenClaw MasterClass',
  tagline: '全球最完整的 OpenClaw 學習資源中心 | The Most Comprehensive OpenClaw Resource',
  favicon: 'img/favicon.ico',

  url: 'https://tenten.co',
  baseUrl: '/openclaw/',

  organizationName: 'tenten',
  projectName: 'openclaw-masterclass',

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn'
    }
  },

  headTags: [
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'OpenClaw MasterClass',
        url: 'https://tenten.co/openclaw/',
        description: 'The most comprehensive OpenClaw learning resource center with 12-module MasterClass, Top 50 Skills guide, and community resources.',
        inLanguage: ['zh-Hant', 'en', 'ja', 'zh-Hans', 'ko'],
        publisher: {
          '@type': 'Organization',
          name: 'tenten',
          url: 'https://tenten.co',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://tenten.co/openclaw/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      }),
    },
  ],

  i18n: {
    defaultLocale: 'zh-Hant',
    locales: ['zh-Hant', 'en', 'ja', 'zh-Hans', 'ko'],
    localeConfigs: {
      'zh-Hant': { label: '繁體中文', direction: 'ltr' },
      en: { label: 'English', direction: 'ltr' },
      ja: { label: '日本語', direction: 'ltr' },
      'zh-Hans': { label: '简体中文', direction: 'ltr' },
      ko: { label: '한국어', direction: 'ltr' },
    },
  },

  future: {
    experimental_faster: true,
    v4: true
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/tenten/openclaw-masterclass/tree/main/',
          docItemComponent: '@theme/ApiItem',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css'
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/openclaw-social-card.jpg',
      metadata: [
        { name: 'keywords', content: 'OpenClaw, AI agent, 養龍蝦, MasterClass, tutorial, skills, ClawHub, automation, multi-agent, browser agent' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { property: 'og:site_name', content: 'OpenClaw MasterClass' },
        { property: 'og:locale', content: 'zh_TW' },
        { property: 'og:locale:alternate', content: 'en_US' },
        { property: 'og:locale:alternate', content: 'ja_JP' },
        { property: 'og:locale:alternate', content: 'zh_CN' },
        { property: 'og:locale:alternate', content: 'ko_KR' },
        { name: 'author', content: 'tenten' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      ],
      navbar: {
        title: 'OpenClaw MasterClass',
        logo: {
          alt: 'OpenClaw MasterClass Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo-dark.svg',
        },
        items: [
          {
            type: 'dropdown',
            label: 'MasterClass',
            position: 'left',
            items: [
              { label: '課程總覽', to: '/docs/masterclass/overview' },
              { label: '模組 1: 基礎架構', to: '/docs/masterclass/module-01-foundations' },
              { label: '模組 2: Gateway', to: '/docs/masterclass/module-02-gateway' },
              { label: '模組 3: Skills 系統', to: '/docs/masterclass/module-03-skills-system' },
              { label: '模組 4: ClawHub', to: '/docs/masterclass/module-04-clawhub' },
              { label: '模組 5: 記憶系統', to: '/docs/masterclass/module-05-memory' },
              { label: '模組 6: 自動化', to: '/docs/masterclass/module-06-automation' },
              { label: '模組 7: 瀏覽器', to: '/docs/masterclass/module-07-browser' },
              { label: '模組 8: 多 Agent', to: '/docs/masterclass/module-08-multi-agent' },
              { label: '模組 9: 安全性', to: '/docs/masterclass/module-09-security' },
              { label: '模組 10: 部署', to: '/docs/masterclass/module-10-production' },
              { label: '模組 11: 語音 & Canvas', to: '/docs/masterclass/module-11-voice-canvas' },
              { label: '模組 12: 企業級', to: '/docs/masterclass/module-12-enterprise' },
            ],
          },
          {
            label: 'Top 50 Skills',
            to: '/docs/top-50-skills/overview',
            position: 'left',
          },
          {
            type: 'dropdown',
            label: '資源',
            position: 'left',
            items: [
              { label: '資源目錄', to: '/docs/resources/official-links' },
              { label: '學習路線圖', to: '/docs/resources/learning-path' },
              { label: 'API Key 指南', to: '/docs/resources/api-keys-guide' },
              { label: '生態系工具', to: '/docs/resources/tools-ecosystem' },
            ],
          },
          {
            label: '社群',
            to: '/docs/communities/top-10',
            position: 'left',
          },
          {
            type: 'dropdown',
            label: 'Reddit',
            position: 'left',
            items: [
              { label: '討論技巧', to: '/docs/reddit/discussion-hacks' },
              { label: 'Top 30 Showcase', to: '/docs/reddit/top-30-showcases' },
            ],
          },
          {
            label: "What's New",
            to: '/docs/whats-new/march-2026',
            position: 'left',
          },
          {
            to: '/blog',
            label: 'Blog',
            position: 'left'
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/openclaw/openclaw',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository'
          }
        ]
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: true
        }
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '學習',
            items: [
              { label: '快速開始', to: '/docs/getting-started/installation' },
              { label: 'MasterClass 課程', to: '/docs/masterclass/overview' },
              { label: 'Top 50 Skills', to: '/docs/top-50-skills/overview' },
              { label: 'FAQ', to: '/docs/faq' },
            ]
          },
          {
            title: '社群',
            items: [
              { label: 'Official Discord', href: 'https://discord.gg/openclaw' },
              { label: 'Reddit r/openclaw', href: 'https://reddit.com/r/openclaw' },
              { label: 'GitHub Discussions', href: 'https://github.com/openclaw/openclaw/discussions' },
              { label: 'X / Twitter', href: 'https://x.com/openclaw' },
            ]
          },
          {
            title: '資源',
            items: [
              { label: 'Blog', to: '/blog' },
              { label: '安全指南', to: '/docs/security/best-practices' },
              { label: 'API 參考', to: '/docs/architecture/api-reference' },
              { label: 'GitHub', href: 'https://github.com/openclaw/openclaw' },
            ]
          },
          {
            title: '更多',
            items: [
              { label: '術語表', to: '/docs/glossary' },
              { label: '排名方法論', to: '/docs/methodology' },
              { label: '最新變更', to: '/docs/whats-new/march-2026' },
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} OpenClaw MasterClass. 以 MIT 授權釋出。本站為社群驅動的學習資源，非 OpenClaw 官方網站。`
      },
      prism: {
        additionalLanguages: [
          'bash',
          'json',
          'yaml',
          'docker',
          'toml',
          'python',
          'javascript',
          'typescript',
        ]
      },
      languageTabs: [
        { highlight: 'bash', language: 'curl', logoClass: 'curl' },
        { highlight: 'python', language: 'python', logoClass: 'python' },
        { highlight: 'javascript', language: 'nodejs', logoClass: 'nodejs' },
        { highlight: 'go', language: 'go', logoClass: 'go' },
      ]
    }),

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        indexPages: false,
        docsRouteBasePath: '/docs',
        blogRouteBasePath: '/blog',
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
    ],
    'docusaurus-theme-openapi-docs'
  ],

  plugins: [
    ['./src/plugins/webpack-alias.js', {}],
    ['./src/plugins/tailwind-config.js', {}],
    [
      'docusaurus-plugin-openapi-docs',
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
    ],
    [
      'ideal-image',
      /** @type {import('@docusaurus/plugin-ideal-image').PluginOptions} */
      ({
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        disableInDev: true
      })
    ],
    [
      './src/plugins/blog-plugin',
      {
        path: 'blog',
        editLocalizedFiles: false,
        blogTitle: 'OpenClaw MasterClass Blog',
        blogDescription: 'OpenClaw 最新消息、教學文章與社群精選',
        blogSidebarCount: 'ALL',
        blogSidebarTitle: '所有文章',
        routeBasePath: 'blog',
        include: ['**/*.md', '**/*.mdx'],
        exclude: [
          '**/_*.{js,jsx,ts,tsx,md,mdx}',
          '**/_*/**',
          '**/*.test.{js,jsx,ts,tsx}',
          '**/__tests__/**'
        ],
        postsPerPage: 6,
        truncateMarker: /<!--\s*(truncate)\s*-->/,
        showReadingTime: true,
        onUntruncatedBlogPosts: 'ignore',
        editUrl: 'https://github.com/tenten/openclaw-masterclass/tree/main/',
        remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]]
      }
    ]
  ]
}

export default config
