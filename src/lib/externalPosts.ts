import Parser from 'rss-parser';
import { EXTERNAL_FEEDS } from '../consts';

export interface ExternalPost {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  source: string;
  /** Canonical URL of the original post. */
  link: string;
  /** Full post HTML from the feed's content:encoded. */
  contentHtml: string;
}

type FeedItem = {
  title?: string;
  link?: string;
  guid?: string;
  isoDate?: string;
  pubDate?: string;
  contentSnippet?: string;
  content?: string;
  contentEncoded?: string;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// Fetch + parse once per build, then reuse across pages.
let cache: ExternalPost[] | null = null;

export async function getExternalPosts(): Promise<ExternalPost[]> {
  if (cache) return cache;

  if (EXTERNAL_FEEDS.length === 0) {
    cache = [];
    return cache;
  }

  const parser = new Parser<unknown, FeedItem>({
    customFields: { item: [['content:encoded', 'contentEncoded']] },
  });

  const posts: ExternalPost[] = [];
  const seen = new Set<string>();

  for (const feed of EXTERNAL_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      for (const item of parsed.items) {
        const title = item.title?.trim() || 'Untitled';
        let slug = slugify(title || item.guid || '');
        if (!slug) continue;
        // Disambiguate duplicate slugs across/within feeds.
        let unique = slug;
        let n = 2;
        while (seen.has(unique)) unique = `${slug}-${n++}`;
        seen.add(unique);

        const dateStr = item.isoDate || item.pubDate;
        posts.push({
          slug: unique,
          title,
          description: (item.contentSnippet || '').replace(/\s+/g, ' ').trim().slice(0, 200),
          pubDate: dateStr ? new Date(dateStr) : new Date(0),
          source: feed.source,
          link: item.link || '',
          // NOTE: rendered with set:html. This is your own content from feeds
          // you control; add sanitization here if you ingest untrusted feeds.
          contentHtml: item.contentEncoded || item.content || '',
        });
      }
    } catch (err) {
      // Don't fail the whole build if one feed is unreachable.
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[externalPosts] Failed to fetch "${feed.source}" (${feed.url}): ${msg}`);
    }
  }

  cache = posts;
  return cache;
}
