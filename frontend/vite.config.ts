import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {nodePolyfills} from "vite-plugin-node-polyfills";
import tailwindcss from "@tailwindcss/vite";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    nodePolyfills(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
