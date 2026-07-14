---
title: "How to debug Cloudflare Workers locally"
description: "A reliable method for setting up local Wrangler dev and inspecting requests."
date: 2026-07-10
tags: ["cloudflare", "workers", "debugging", "wrangler"]
category: "backend"
source: "claude-session-abc123"
---

## Problem

Testing Cloudflare Workers in production is slow. You want fast feedback loops with `wrangler dev`.

## Solution

1. Install Wrangler globally:

```bash
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler
npm install -g wrangler


```

2. Authenticate once:

```bash
wrangler login
```

3. Run the local dev server:

```bash
wrangler dev --local
```

4. Add `console.log()` statements in your Worker. They appear in the terminal instantly.

## Pro tip

Use `wrangler tail` to stream production logs when you need to inspect live traffic without redeploying.
