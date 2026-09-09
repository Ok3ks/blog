import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The `blog` collection: one Markdown/MDX file per post in src/content/blog/.
// Uses Astro 5's Content Layer glob loader.
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string dates to Date objects.
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
