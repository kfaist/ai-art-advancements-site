import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Use environment variables for site and base values
const { ASTRO_SITE, ASTRO_BASE } = process.env;

export default defineConfig({
  site: ASTRO_SITE,
  base: ASTRO_BASE,
  integrations: [sitemap()]
});
