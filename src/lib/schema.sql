 -- watches
  create table watches (
    id text primary key default gen_random_uuid()::text,
    label text not null,
    keywords text[] not null default '{}',
    source_urls text[] not null default '{}',
    enabled boolean not null default true,
    score_threshold integer not null default 60,
    created_at timestamptz not null default now()
  );
  alter table watches enable row level security;
  create policy "auth users full access" on watches for all to authenticated using (true) with check
  (true);

  -- topics
  create table topics (
    id text primary key default gen_random_uuid()::text,
    title text not null,
    source_url text not null,
    relevance_score integer not null,
    summary text not null,
    content_snippet text not null default '',
    status text not null default 'new',
    watch_label text,
    model text,
    created_at timestamptz not null default now()
  );
  alter table topics enable row level security;
  create policy "auth users full access" on topics for all to authenticated using (true) with check (true);

  -- delivery_settings
  create table delivery_settings (
    id text primary key default 'default',
    slack_webhook_url text not null default '',
    notify_above integer not null default 70,
    updated_at timestamptz not null default now()
  );
  alter table delivery_settings enable row level security;
  create policy "auth users full access" on delivery_settings for all to authenticated using (true) with
  check (true);

  insert into delivery_settings (id) values ('default') on conflict do nothing;