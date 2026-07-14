---
title: "Organizing content in Astro with Content Collections"
description: "Use typed schemas and the glob loader to manage large amounts of Markdown."
date: 2026-07-14
tags: ["astro", "markdown", "content-collections"]
category: "frontend"
source: "claude-session-idea01"
---

## What are Content Collections?

Content Collections are Astro's way to organize, validate, and query Markdown or MDX files.

## Setup

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const learnings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/learnings' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { learnings };
```

## Querying

```ts
import { getCollection } from 'astro:content';

const posts = await getCollection('learnings');
```

## Why this scales

- Type safety on frontmatter
- Validation at build time
- Easy filtering, sorting, and grouping
- Works with thousands of files
