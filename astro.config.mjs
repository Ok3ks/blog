// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// NOTE: Update `site` to your GitHub Pages URL and `base` to your repo name.
// For a project page the URL is https://<user>.github.io/<repo> so:
//   site: 'https://<user>.github.io', base: '/blog'
// For a user/org page repo named <user>.github.io, set base: '/' (or omit).
export default defineConfig({
  site: 'https://ok3ks.github.io',
  base: '/blog',
  integrations: [mdx(), sitemap()],
});
