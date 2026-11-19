import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // relative asset paths so the build also opens by double-click (file://) with
  // no server at all — and still deploys to any static host unchanged
  base: './',
  // the app targets evergreen school devices; es2018 keeps output widely compatible
  build: { target: 'es2018', sourcemap: false }
});
