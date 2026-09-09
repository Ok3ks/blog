---
title: 'Welcome to your new blog'
description: 'A quick tour of how this Astro blog is put together and how to write your first post.'
pubDate: 2026-09-09
tags: ['meta', 'getting-started']
---

Welcome! This is a starter post to show you how everything fits together. Delete
it whenever you're ready to make the blog your own.

## Writing posts

Each post is a Markdown (`.md`) or MDX (`.mdx`) file in `src/content/blog/`. The
frontmatter at the top defines the post's metadata:

```yaml
---
title: 'Your post title'
description: 'A one-line summary used for previews and SEO.'
pubDate: 2026-09-09
tags: ['tag-one', 'tag-two']
draft: false
---
```

Set `draft: true` to keep a post out of the build while you work on it.

## Styling

The look of the site is driven by design tokens (colors, fonts, spacing) defined
at the top of `src/styles/global.css`. Change them in one place and the whole
site updates — including the built-in light and dark themes.

## What's included

- Light/dark theme toggle with no flash on load
- Responsive, accessible base layout
- RSS feed at `/rss.xml` and an auto-generated sitemap
- SEO + Open Graph tags on every page

> Tip: edit your name, site title, and navigation in `src/consts.ts`.

Happy writing!
