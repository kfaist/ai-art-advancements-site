# AI Art Advancements Blog

This is the source code for the AI Art Advancements site built with [Astro](https://astro.build/). It is configured to deploy to GitHub Pages on every push to `main` via a GitHub Actions workflow. You can also optionally connect this repo to Vercel for automatic previews and production deploys.

## Local development

1. Install dependencies:

```bash
npm install
```

2. Run a local dev server:

```bash
npm run dev
```

3. Build the site for production:

```bash
npm run build
```

## Deploying

By default, this repo uses [GitHub Pages](https://pages.github.com/) for hosting. The workflow defined in `.github/workflows/pages.yml` will build and publish the site to the `gh-pages` branch on push to `main`. Make sure Pages is enabled on the repository and set to deploy from the `gh-pages` branch.

The live site will be available at:

```
https://kfaist.github.io/ai-art-advancements-site
```

## Connect to Vercel (optional)

If you prefer to use Vercel for hosting:

1. Install the **Vercel GitHub App** and import this repository.
2. During import, set **Root directory** to `/`.
3. Optionally define environment variables:
   - `PUBLIC_SITE_NAME` – Name of the site displayed in metadata.
   - `PUBLIC_SITE_TAGLINE` – Short tagline.
4. Deploy the site from the Vercel dashboard.

## Publishing new posts

Blog posts live in the `content/posts/` directory as `.md` files. To publish a new post:

1. Create a new branch (e.g. `post/my-new-topic`).
2. Add a new Markdown file to `content/posts/` with frontmatter:

```md
---
title: "My New Topic"
description: "A short summary that appears on blog index and meta tags"
date: "2025-10-05"
tags: ["ai", "art"]
---
Your content here...
```

3. Commit and push the branch, then open a pull request against `main`.
4. Once merged, the GitHub Actions workflow will build and deploy the updated site.

---

Feel free to adjust the content and styles to suit your project!
