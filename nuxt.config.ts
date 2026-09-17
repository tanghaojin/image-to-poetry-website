import tailwindcss from '@tailwindcss/vite'

const baseURL = process.env.NUXT_APP_BASE_URL || '/'
const siteURL = 'https://imagetopoetry.com'
const siteTitle = '见景寻诗｜上传照片智能匹配真实古典诗词并生成高清诗意海报的免费在线图片配诗创作工具'
const siteDescription = '上传一张照片，找到最贴近画面意境的真实古典诗词，并生成保持原图比例的高清诗意海报。'
const isProduction = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-11',
  devtools: { enabled: true },
  devServer: { port: 3100 },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'
    }
  },
  nitro: {
    preset: 'github-pages'
  },
  modules: [
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap'
  ],
  site: {
    url: siteURL,
    name: '见景寻诗',
    description: siteDescription,
    defaultLocale: 'zh-CN',
    indexable: isProduction
  },
  i18n: {
    baseUrl: siteURL,
    strategy: 'prefix_except_default',
    defaultLocale: 'zh-CN',
    langDir: 'locales',
    detectBrowserLanguage: false,
    locales: [
      { code: 'zh-CN', language: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'zh-TW', language: 'zh-TW', name: '繁體中文', file: 'zh-TW.json' },
      { code: 'en', language: 'en', name: 'English', file: 'en.json' }
    ]
  },
  sitemap: {},
  hooks: {
    'build:manifest'(manifest) {
      // Dynamic import alone still lets Nuxt emit an SSR prefetch hint.
      // Keep fingerprint collection and its download behind explicit analysis.
      for (const [id, chunk] of Object.entries(manifest)) {
        if (`${id} ${chunk.src || ''}`.includes('@fingerprintjs')) {
          chunk.prefetch = false
          chunk.preload = false
        }
      }
    }
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  app: {
    baseURL,
    head: {
      title: siteTitle,
      titleTemplate: '%s',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: `${baseURL}favicon.ico` },
        { rel: 'icon', type: 'image/png', sizes: '64x64', href: `${baseURL}favicon-poem.png` }
      ],
      meta: [
        {
          name: 'description',
          content: siteDescription
        },
        { name: 'theme-color', content: '#f4f0e7' }
      ]
    }
  }
})
