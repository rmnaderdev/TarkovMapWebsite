// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt", "@pinia/nuxt"],
  plugins: [
    {
      src: "~/plugins/vue3-openlayers.ts",
      mode: "client",
    },
  ],
  css: ["~/assets/css/main.css"],
  devServer: {
    https: {
      key: "./server.key",
      cert: "./server.crt",
    },
  },
  app: {
    head: {
      bodyAttrs: {
        class: "flex flex-col min-h-screen max-h-screen",
      },
    },
  },
});
