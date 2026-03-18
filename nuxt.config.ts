// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL
  },
  nitro: {
    ...(process.env.NODE_ENV === 'production' && {
      preset: 'vercel'
    }),
    esbuild: {
      options: {
        target: 'es2022'  // สำคัญสำหรับ Vercel
      }
    }
  },
  experimental: {
    payloadExtraction: false
  },
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit']
    },
    server: {
      watch: {
        usePolling: true
      },
      hmr: {
        port: 24678  // เปลี่ยน HMR port
      }
    }
  }
})
