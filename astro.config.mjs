// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Served on the custom domain hi-emmanuel.com (GitHub Pages origin, Cloudflare
// in front). Site lives at the domain root, so base is '/'. See deploy.md.
export default defineConfig({
  site: 'https://hi-emmanuel.com',
  base: '/',
  integrations: [mdx(), sitemap()],
});
