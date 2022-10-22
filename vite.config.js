import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/<3d>/',
  build: {
    minify: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'page2.html'),
        nested2: resolve(__dirname, 'styles.css'),
        nested3: resolve(__dirname, 'page3.html'),
        nested4: resolve(__dirname, 'dropDown.js')
      }
    }
  }
})
