import { getCollection } from 'astro:content';
import { getExternalPosts } from './externalPosts';
import { withBase } from './url';

export interface PostSummary {
  title: string;
  description: string;
  pubDate: Date;
  /** Fully-qualified (base-prefixed) URL to the post on this site. */
  url: string;
  /** External source name (e.g. "Medium"), or null for local posts. */
  source: string | null;
  /** Custom tags (from local post frontmatter); empty for external posts. */
  tags: string[];
}

export async function getLocalSummaries(): Promise<PostSummary[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((p) => ({
    title: p.data.title,
    description: p.data.description,
    pubDate: p.data.pubDate,
    url: withBase(`blog/${p.id}/`),
    source: null,
    tags: p.data.tags,
  }));
}

export async function getExternalSummaries(): Promise<PostSummary[]> {
  const posts = await getExternalPosts();
  return posts.map((p) => ({
    title: p.title,
    description: p.description,
    pubDate: p.pubDate,
    url: withBase(`external/${p.slug}/`),
    source: p.source,
    tags: [],
  }));
}

/** All posts (local + external), newest first. */
export async function getAllSummaries(): Promise<PostSummary[]> {
  const [local, external] = await Promise.all([
    getLocalSummaries(),
    getExternalSummaries(),
  ]);
  return [...local, ...external].sort(
    (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()
  );
}
