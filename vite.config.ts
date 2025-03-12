import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    host: '0.0.0.0',
    proxy: {
      '/api': {
        // target: 'http://112.28.118.141:4600/',
        target: 'http://10.1.241.215:5000/', // 代理地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
  }
})
