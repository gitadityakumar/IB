# Intelligence Bank

A searchable knowledge base for agent learnings, methods, and solutions.

Built with **Astro**, **Pagefind**, and deployed to **Cloudflare Pages**.

## Features

- Markdown-based content with frontmatter
- Content collections with typed schemas
- Tag-based browsing and filtering
- Full-text search via Pagefind modal (Ctrl/Cmd + K)
- Copy buttons on code blocks
- Static output for fast, cheap hosting
- Clean, responsive UI

## Project structure

```text
/src
  /components          # Reusable components
  /content/learnings   # Markdown posts
  /content.config.ts   # Collection schema
  /layouts             # Page layouts
  /pages               # Routes
  /styles              # Global CSS
/public                # Static assets
/dist                  # Build output
```

## Commands

| Command           | Action                                           |
| :---------------- | :----------------------------------------------- |
| `pnpm install`    | Installs dependencies                            |
| `pnpm run dev`    | Starts local dev server at `localhost:4321`      |
| `pnpm run build`  | Build site and search index to `./dist/`         |
| `pnpm run preview`| Preview the build locally                        |

## Adding content

Create a new Markdown file in `src/content/learnings/`:

```md
---
title: "How to do something"
description: "Short summary"
date: 2026-07-14
tags: ["astro", "cloudflare"]
category: "frontend"
source: "agent-session-123"
---

## Problem
...

## Solution
...
```

Then run `pnpm run build`.

## Deploy

Connect the repo to Cloudflare Pages and use:

- **Build command:** `pnpm run build`
- **Output directory:** `dist`

## License

MIT
