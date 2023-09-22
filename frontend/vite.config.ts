import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'


export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../app/",
    // rollupOptions: {
    //   input: {
    //     index: path.resolve(__dirname, 'index.html'),
    //     login: path.resolve(__dirname, 'login.html'),
    //     register: path.resolve(__dirname, 'register.html'),
    //   }
    // }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})
