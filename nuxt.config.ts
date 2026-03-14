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
    preset: 'vercel',  // สำหรับ serverless functions รองรับ Postgres
    esbuild: {
      options: {
        target: 'es2022'  // สำคัญสำหรับ Vercel
      }
    }
  },
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit']
    },
    server: {
      hmr: {
        host: 'localhost',
        port: 3000,
        protocol: 'ws'
      }
    }
  }
})
