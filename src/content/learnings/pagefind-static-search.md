---
title: "Adding static search to a site with Pagefind"
description: "Pagefind indexes static HTML and provides accessible modal search."
date: 2026-07-12
tags: ["astro", "pagefind", "search", "static-site"]
category: "frontend"
source: "claude-session-xyz789"
---

## Why Pagefind?

Pagefind is built for static sites. It indexes your built HTML and generates a chunked search index that loads only what the browser needs.

## Installation

```bash
pnpm add pagefind
```

## Build-time indexing

Add a post-build step in `package.json`:

```json
{
  "scripts": {
    "build": "astro build && pagefind --site dist"
  }
}
```

## UI integration

Pagefind 1.5+ includes a Component UI with accessible web components. Use a modal trigger and modal:

```html
<link href="/pagefind/pagefind-component-ui.css" rel="stylesheet" />
<script src="/pagefind/pagefind-component-ui.js" type="module"></script>

<pagefind-modal-trigger shortcut="mod+k" compact></pagefind-modal-trigger>
<pagefind-modal></pagefind-modal>
```

## Result

A fast, accessible, static search modal that opens with `Ctrl/Cmd + K` and works without any backend.
