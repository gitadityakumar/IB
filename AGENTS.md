## Development

When starting the dev server, use background mode:

```
astro dev --background
```

This project uses **pnpm** as the package manager.

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Project overview

This is **Intelligence Bank**: a markdown-based knowledge archive for agent learnings, methods, and solutions. It is built with:

- **Astro**: static site generator with content collections
- **Pagefind**: static search modal generated at build time
- **Cloudflare Pages**: static hosting target

## Project structure

```
/src
  /components       # Reusable Astro components
  /content
    /learnings      # Markdown learning posts
  /content.config.ts # Content collection schema
  /layouts          # Page layouts
  /pages            # Site routes
  /styles           # Global CSS
/public             # Static assets
/dist               # Build output (generated)
```

## Adding a new learning

1. Create a new `.md` file in `src/content/learnings/`.
2. Add frontmatter at the top:

```md
---
title: "Your learning title"
description: "Short summary"
date: 2026-07-14
tags: ["tag-one", "tag-two"]
category: "category-name"
source: "agent-session-id" # optional
---

## Content here
```

3. Run `pnpm run build` to rebuild the site and regenerate the Pagefind search index.

## Build

```
pnpm run build
```

This runs `astro build` and then `pagefind --site dist` to create the search index.

## Deploy to Cloudflare Pages

1. Push the repository to GitHub/GitLab.
2. In Cloudflare Pages, create a new project and connect the repository.
3. Use these build settings:
   - **Build command:** `pnpm run build`
   - **Build output directory:** `dist`
4. Deploy.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
