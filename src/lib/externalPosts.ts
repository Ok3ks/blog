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

// Plain-text teaser for feeds (e.g. Medium) that ship no summary.
function excerpt(html: string, max = 160): string {
  const text = html
    .replace(/<(figure|pre|style|script|h[1-6])\b[\s\S]*?<\/\1>/gi, ' ')
    // Medium marks headings up as all-bold paragraphs.
    .replace(/<p>\s*<(strong|b)>[^<]*<\/\1>\s*<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
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
        const contentHtml = item.contentEncoded || item.content || '';
        const snippet = (item.contentSnippet || '').replace(/\s+/g, ' ').trim().slice(0, 200);
        posts.push({
          slug: unique,
          title,
          description: snippet || excerpt(contentHtml),
          pubDate: dateStr ? new Date(dateStr) : new Date(0),
          source: feed.source,
          link: item.link || '',
          // NOTE: rendered with set:html. This is your own content from feeds
          // you control; add sanitization here if you ingest untrusted feeds.
          contentHtml,
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
