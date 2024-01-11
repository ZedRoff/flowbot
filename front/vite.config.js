import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import config from "../config.json"
// https://vitejs.dev/config/
export default defineConfig({
 
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: `http://${config.URL}:5000/`,
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
   
      
      },
    },
  },
  plugins: [react()]
})
 
