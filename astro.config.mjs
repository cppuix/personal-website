import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://alqaddari.vercel.app',
  integrations: [sitemap()],
  adapter: vercel(),

    devToolbar: {
    enabled: false
  }
});