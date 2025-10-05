import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Use environment variables for site, base and custom values
const {
  ASTRO_SITE,
  ASTRO_BASE,
  NEWSLETTER_PROVIDER,
  BEEHIIV_PUBLICATION_ID,
  ANALYTICS_PROVIDER,
  PLAUSIBLE_DOMAIN,
  TWITTER_HANDLE,
  DEFAULT_OG_IMAGE,
} = process.env;

export default defineConfig({
  site: ASTRO_SITE,
  base: ASTRO_BASE,
  integrations: [sitemap()],
  vite: {
    define: {
      'import.meta.env.NEWSLETTER_PROVIDER': JSON.stringify(NEWSLETTER_PROVIDER),
      'import.meta.env.BEEHIIV_PUBLICATION_ID': JSON.stringify(BEEHIIV_PUBLICATION_ID),
      'import.meta.env.ANALYTICS_PROVIDER': JSON.stringify(ANALYTICS_PROVIDER),
      'import.meta.env.PLAUSIBLE_DOMAIN': JSON.stringify(PLAUSIBLE_DOMAIN),
      'import.meta.env.TWITTER_HANDLE': JSON.stringify(TWITTER_HANDLE),
      'import.meta.env.DEFAULT_OG_IMAGE': JSON.stringify(DEFAULT_OG_IMAGE),
    },
  },
});
