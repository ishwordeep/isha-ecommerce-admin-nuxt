import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: true,
  devServer: {
    port: 6001,
    host: 'localhost',
  },

  srcDir: 'app',

  app: {
    head: {
      title: 'Ecommerce | Admin',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        { name: 'description', content: 'Ecommerce | Admin' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiUrl: '',
      appUrl: '',
      secureCookies: process.env.NODE_ENV === 'production',
    },
  },

  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui', '@nuxt/fonts', '@pinia/nuxt'],

  image: {
    dir: 'assets/images',
  },
  ui: {
    colorMode: false,
  },

  css: ['~/assets/css/main.css'],
})
