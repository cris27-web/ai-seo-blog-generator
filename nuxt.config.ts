export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
  [
    '@netlify/nuxt',
    {
      blobs: { enabled: true },
      edgeFunctions: { enabled: false },
      functions: { enabled: false },
      database: { enabled: false },
    },
  ],
],

  runtimeConfig: {
    geminiApiKey: '',
  },
  

})
