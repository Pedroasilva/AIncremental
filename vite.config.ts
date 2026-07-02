import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// GitHub Pages serves project sites under /<repo>/. Override with VITE_BASE in dev.
const base = process.env.VITE_BASE ?? '/AIncremental/';

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@engine': fileURLToPath(new URL('./src/engine', import.meta.url)),
      '@content': fileURLToPath(new URL('./src/content', import.meta.url)),
      '@store': fileURLToPath(new URL('./src/store', import.meta.url)),
      '@ui': fileURLToPath(new URL('./src/ui', import.meta.url)),
      '@render': fileURLToPath(new URL('./src/render', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
    },
  },
});
