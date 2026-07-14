---
name: learnings
description: Format, draft, and publish new learnings, methods, and insights to the Intelligence Bank archive. Triggered when the user mentions "/learnings", "/learn", "add learning", "new learning", or asks to document a lesson or solution.
---

# Publish a Learning to Intelligence Bank

This skill guides the agent in formatting and publishing a new learning entry to the Intelligence Bank repository.

## Triggers
- Mentions of `/learnings`
- Requests to "add a learning", "document this solution", or "save this fix"
- Explicit instructions to archive a method, insight, or bug resolution

## Checklist & Workflow

### 1. Gather Information
Extract the details of the problem and the final solution from the current session or previous conversation steps. The entry must contain:
- **Title**: A clear, concise title describing the learning (e.g., "Fixing Cloudflare Wrangler CORS issues").
- **Description**: A short (1-2 sentence) summary.
- **Date**: The current date (formatted as YYYY-MM-DD).
- **Tags**: List of relevant technical tags (e.g., `["astro", "javascript", "cors"]`).
- **Category**: Broad classification (e.g., `frontend`, `backend`, `devops`, `tooling`, `ai`).
- **Source**: The current agent session ID or reference ID if applicable.

### 2. Format the Content
Create a new Markdown file at `/src/content/learnings/<kebab-case-title>.md`.

Ensure it strictly adheres to the following template:

```markdown
---
title: "Clear learning title"
description: "Short summary"
date: YYYY-MM-DD
tags: ["tag-one", "tag-two"]
category: "category-name"
source: "session-id-or-identifier"
---

## Problem
Describe the problem encountered. Include error logs, symptom descriptions, or code fragments showing the bug/issue.

## Solution
Explain the solution. Provide the corrected code, configuration settings, or command sequences that resolved the issue. Detail why the solution works and any best practices learned.
```

### 3. Rebuild the Archive
After writing the file, you **MUST** run the project build command to regenerate the site and update the Pagefind static search index.
```bash
pnpm run build
```

### 4. Report Back
Inform the user that the learning has been successfully documented, linking to the newly created file in your response.
