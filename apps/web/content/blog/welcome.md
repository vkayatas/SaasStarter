---
title: "Welcome to Our Blog"
description: "The first post on our new SaaS blog. Learn what we're building and why."
date: 2026-03-01
author: "Team"
tags: ["announcement", "launch"]
---

Welcome to our blog! This is a sample post to demonstrate the blog system built into SaaS Starter.

## How the blog works

Blog posts are written as Markdown files in the `content/blog/` directory. Each file uses frontmatter for metadata:

```yaml
---
title: "Your Post Title"
description: "A short description for previews and SEO"
date: 2026-03-01
author: "Author Name"
tags: ["tag1", "tag2"]
---
```

The body is standard Markdown rendered as HTML.

## Adding new posts

1. Create a new `.md` file in `apps/web/content/blog/`
2. Add frontmatter with title, description, date, author, and tags
3. Write your content in Markdown
4. The post appears automatically - no rebuild needed in development

## What's next

Replace these example posts with your own content. The blog supports tags, author attribution, and date-based sorting out of the box.
