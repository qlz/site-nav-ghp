# Site Navigator for GitHub Pages

This project is now a static Vite site intended for GitHub Pages. It preserves
the existing Site Navigator UI while moving shared data and uploaded HTML files
to Supabase.

## What changed

- The site builds to static assets with Vite.
- Route CRUD and taxonomy updates go directly from the browser to Supabase.
- Uploaded HTML files are stored in Supabase Storage and loaded in the viewer.
- Collapse state remains browser-local in `localStorage`.

## Required Supabase setup

1. Create a Supabase project.
2. Run [supabase-schema.sql](./supabase-schema.sql) in the SQL editor.
3. Create a storage bucket named `uploads` and make it public.
4. Add anonymous storage policies that allow read/write if you want the current
   shared-edit model.

This repo assumes:

- a `routes` table
- a `taxonomy` table
- a public `uploads` bucket

## Local development

1. Copy `.env.example` to `.env`.
2. Fill in:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - optional `VITE_SUPABASE_UPLOADS_BUCKET`
3. Install dependencies and run the site:

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
```

The Vite config automatically uses `/${repo-name}/` as the base path inside
GitHub Actions. You can override that locally with `VITE_GITHUB_PAGES_BASE`.

## GitHub Pages deployment

The workflow at [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml)
builds and deploys the static site.

Set these repository secrets before enabling Pages:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Optional repository variable:

- `VITE_SUPABASE_UPLOADS_BUCKET`

## Notes

- External URLs may refuse to render in an iframe because of their own
  `X-Frame-Options` or CSP rules.
- The current data model allows anonymous browser writes because the target
  behavior is “anyone with the URL can edit the shared library.”
