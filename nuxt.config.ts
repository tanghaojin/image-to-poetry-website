import tailwindcss from '@tailwindcss/vite'

const baseURL = process.env.NUXT_APP_BASE_URL || '/'

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
  modules: ['@nuxt/icon'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: '见景寻诗 - 免费图片配诗工具',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` }],
      meta: [
        {
          name: 'description',
          content: '上传一张照片，找到最贴近画面意境的真实古典诗词，并生成保持原图比例的诗意海报。'
        },
        { name: 'theme-color', content: '#f4f0e7' }
      ]
    }
  }
})
