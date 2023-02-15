
import { defineConfig } from "vite"
import uni from "@dcloudio/vite-plugin-uni"
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
    }
  },
  plugins: [uni()],
  server: {
    // proxy: {
    //   [process.env.VUE_APP_BASE_API]: {
    //     target: 'http://localhost:8000',
    //     changeOrigin: true,
    //     rewrite: path => path.replace(new RegExp('^' + process.env.VUE_APP_BASE_API), '')
    //   },
    // }
  },
  define: {
    'process.env.MY_ENV': JSON.stringify('helloworld')
  }

})
