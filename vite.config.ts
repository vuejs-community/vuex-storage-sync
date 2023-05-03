import vitePluginDTS from 'vite-plugin-dts';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['cjs', 'es', 'umd'],
      name: 'VuexStorageSync'
    }
  },
  plugins: [
    vitePluginDTS({
      insertTypesEntry: true
    })
  ]
});
