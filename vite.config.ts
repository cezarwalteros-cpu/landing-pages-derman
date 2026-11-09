import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Páginas: la landing (/) y el advertorial 504 (/articulo001)
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        articulo001: resolve(__dirname, 'articulo001.html'),
      },
    },
  },
});
