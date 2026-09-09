# Blog

A minimal, fast blog built with [Astro](https://astro.build) and deployed to
GitHub Pages. Posts are written in Markdown/MDX, with a themeable base style
template (light + dark), RSS feed, sitemap, and SEO tags built in.

## Quick start

```bash
npm install
npm run dev      # start the dev server at http://localhost:4321/blog
npm run build    # build the production site to ./dist
npm run preview  # preview the production build locally
```

## Project structure

```
src/
  components/     Reusable UI (Header, Footer, ThemeToggle, PostCard, ...)
  content/
    blog/        Your posts (.md / .mdx) — one file per post
    config.ts    Frontmatter schema for posts
  layouts/       Page shells (BaseLayout, BlogPost)
  pages/         Routes (index, blog/, about, rss.xml, 404)
  styles/        global.css — design tokens + base styles
  consts.ts      Site title, author, nav links, social links
public/          Static assets served as-is (favicon, images)
.github/workflows/deploy.yml   GitHub Pages CI
```

## Writing a post

Create a file in `src/content/blog/`, e.g. `my-post.md`:

```yaml
---
title: 'My post title'
description: 'A one-line summary for previews and SEO.'
pubDate: 2026-09-09
tags: ['tag']
draft: false        # true keeps it out of the build
# heroImage: '/images/cover.jpg'   # optional, from public/
---

Your **Markdown** content here.
```

## Customizing the look

All colors, fonts, and spacing are CSS custom properties at the top of
`src/styles/global.css` (`:root` for light, `:root[data-theme='dark']` for
dark). Change them in one place to re-theme the whole site.

Site title, author, navigation, and social links live in `src/consts.ts`.

## Republishing from Medium / Substack

The blog can pull in posts from external blogs via their RSS feeds and render
them **in full** on this site, each with a `rel="canonical"` link back to the
original (so search engines credit the source, not a duplicate).

Add your feeds in `src/consts.ts`:

```ts
export const EXTERNAL_FEEDS = [
  { source: 'Medium', url: 'https://medium.com/feed/@your-username' },
  { source: 'Substack', url: 'https://your-name.substack.com/feed' },
];
```

On the next build, each external post is fetched, listed alongside your local
posts (with a source badge), and served at `/external/<slug>/`. Feeds are
fetched at build time only — if one is unreachable, the build logs a warning and
continues. Leave the array empty to disable.

> Content is rendered from the feed's HTML via `set:html`. That's fine for feeds
> you own; add sanitization in `src/lib/externalPosts.ts` if you ingest feeds
> you don't control.

## Deploying to GitHub Pages

1. **Set the URL.** In `astro.config.mjs`, set:
   - `site` to `https://<your-username>.github.io`
   - `base` to `'/<your-repo-name>'` (this repo defaults to `/blog`)

   If you name the repo `<your-username>.github.io` (a user page), set
   `base: '/'` instead.

2. **Enable Pages.** In the repo on GitHub: **Settings → Pages → Build and
   deployment → Source → GitHub Actions**.

3. **Push to `main`.** The workflow in `.github/workflows/deploy.yml` builds
   and deploys automatically. Your site will be live at
   `https://<your-username>.github.io/<your-repo-name>/`.

## License

MIT — do what you like.
