import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const learnings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/learnings' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    category: z.string().default('general'),
    source: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { learnings };
