import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    target: 'es2021',
    lib: {
      entry: resolve(__dirname, 'src/plane-radar-card.ts'),
      formats: ['es'],
      fileName: () => 'plane-radar-card.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    outDir: 'custom_components/plane_radar/static',
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
  },
});
