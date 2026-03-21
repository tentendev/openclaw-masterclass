// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  mainSidebar: [
    'intro',
    {
      type: 'category',
      label: '快速開始',
      collapsed: false,
      items: [
        'getting-started/installation',
        'getting-started/first-setup',
        'getting-started/connect-channels',
        'getting-started/choose-llm',
        'getting-started/soul-md-config',
      ],
    },
    {
      type: 'category',
      label: 'MasterClass 課程',
      items: [
        'masterclass/overview',
        'masterclass/module-01-foundations',
        'masterclass/module-02-gateway',
        'masterclass/module-03-skills-system',
        'masterclass/module-04-clawhub',
        'masterclass/module-05-memory',
        'masterclass/module-06-automation',
        'masterclass/module-07-browser',
        'masterclass/module-08-multi-agent',
        'masterclass/module-09-security',
        'masterclass/module-10-production',
        'masterclass/module-11-voice-canvas',
        'masterclass/module-12-enterprise',
      ],
    },
    {
      type: 'category',
      label: 'Top 50 必裝 Skills',
      items: [
        'top-50-skills/overview',
        'top-50-skills/productivity',
        'top-50-skills/development',
        'top-50-skills/communication',
        'top-50-skills/research',
        'top-50-skills/automation',
        'top-50-skills/ai-ml',
        'top-50-skills/smart-home',
        'top-50-skills/media',
        'top-50-skills/data',
        'top-50-skills/safety-guide',
      ],
    },
    {
      type: 'category',
      label: '資源中心',
      items: [
        'resources/official-links',
        'resources/learning-path',
        'resources/api-keys-guide',
        'resources/awesome-lists',
        'resources/video-tutorials',
        'resources/books-articles',
        'resources/tools-ecosystem',
        'resources/chinese-ecosystem',
      ],
    },
    {
      type: 'category',
      label: '社群指南',
      items: [
        'communities/top-10',
        'communities/how-to-engage',
      ],
    },
    {
      type: 'category',
      label: 'Reddit',
      items: [
        'reddit/discussion-hacks',
        'reddit/top-30-showcases',
      ],
    },
    {
      type: 'category',
      label: '架構與 API',
      items: [
        'architecture/overview',
        'architecture/api-reference',
      ],
    },
    {
      type: 'category',
      label: '安全性',
      items: [
        'security/best-practices',
        'security/threat-model',
        'security/skill-audit-checklist',
      ],
    },
    {
      type: 'category',
      label: '疑難排解',
      items: [
        'troubleshooting/common-issues',
      ],
    },
    {
      type: 'category',
      label: '最新消息',
      items: [
        'whats-new/march-2026',
      ],
    },
    'glossary',
    'faq',
    'methodology',
  ],
}

export default sidebars
