// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://john-guerra.github.io',
  base: '/oscar-car-collection',
  output: 'static',
  build: {
    assets: 'assets'
  }
});
