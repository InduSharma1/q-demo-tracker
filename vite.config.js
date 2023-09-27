// import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        slds: '@salesforce-ux/design-system'
      }
    }
  }
})
