import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', //since its used for chrome extension and not on a server all files would load locally
  build: {
    outDir: 'dist',
  },
})
