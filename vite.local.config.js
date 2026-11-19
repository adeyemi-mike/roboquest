import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

/* Single-file build: the whole app (React + engine + CSS) inlined into ONE
   index.html that opens by double-click (file://). Browsers block loading
   external ES modules from file:// origins, so the multi-file dist needs a
   server — this build doesn't. Output: dist-local/index.html */
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
  build: { target: 'es2018', sourcemap: false, outDir: 'dist-local' }
});
