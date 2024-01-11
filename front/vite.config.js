import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import config from "../config.json"
// https://vitejs.dev/config/
export default defineConfig({
 
  server: {
    proxy: {
      "/api": {
        target: `http://${config.URL}:5000/`,
        secure: false,
        changeOrigin: true,
        
      rewrite: (path) => path.replace(/^\/foo/, ''),
   
      
      },
    },
  },
  plugins: [react()]
})
 
