create table if not exists public.routes (
  id text primary key,
  mode text not null check (mode in ('url', 'upload')),
  type text,
  title text,
  description text,
  address text,
  url text,
  source_name text,
  file_path text,
  topic text,
  subtopic text,
  group_label text,
  group_id text,
  classification_status text,
  manual_classification boolean not null default false,
  uploaded_at timestamptz not null default now(),
  last_accessed_at timestamptz,
  renamed_at timestamptz,
  reviewed_at timestamptz
);

create table if not exists public.taxonomy (
  topic text not null,
  subtopic text not null,
  primary key (topic, subtopic)
);

alter table public.routes enable row level security;
alter table public.taxonomy enable row level security;

drop policy if exists "anon routes read" on public.routes;
create policy "anon routes read"
on public.routes for select
to anon
using (true);

drop policy if exists "anon routes write" on public.routes;
create policy "anon routes write"
on public.routes for all
to anon
using (true)
with check (true);

drop policy if exists "anon taxonomy read" on public.taxonomy;
create policy "anon taxonomy read"
on public.taxonomy for select
to anon
using (true);

drop policy if exists "anon taxonomy write" on public.taxonomy;
create policy "anon taxonomy write"
on public.taxonomy for all
to anon
using (true)
with check (true);

-- Create a public storage bucket named `uploads`, then add permissive policies
-- for anonymous read/write if you want the current "anyone with the URL" model.
