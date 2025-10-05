import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kfaist.github.io/ai-art-advancements-site',
  base: '/ai-art-advancements-site',
  integrations: [sitemap()]
});
