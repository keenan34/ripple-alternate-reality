begin;

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text not null,
  display_name text not null,
  bio text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_handle_format check (handle ~ '^[a-z0-9][a-z0-9-]{2,39}$')
);

create unique index profiles_handle_lower_unique on public.profiles (lower(handle));

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  slug text not null,
  title text not null,
  summary text not null,
  sport text not null,
  league text not null,
  current_version_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint stories_slug_format check (slug ~ '^[a-z0-9][a-z0-9-]{0,79}$')
);

create unique index stories_slug_lower_unique
  on public.stories (lower(slug))
  where deleted_at is null;
create index stories_owner_id_idx on public.stories(owner_id);

create table public.story_versions (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  version integer not null check (version > 0),
  schema_version integer not null default 1 check (schema_version > 0),
  status text not null check (status in ('draft', 'in-review', 'published', 'archived')),
  content jsonb not null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  published_at timestamptz,
  constraint story_versions_story_version_unique unique (story_id, version),
  constraint story_versions_published_date check (status <> 'published' or published_at is not null),
  constraint story_versions_content_object check (jsonb_typeof(content) = 'object')
);

alter table public.stories
  add constraint stories_current_version_fk
  foreign key (current_version_id) references public.story_versions(id) on delete set null;

create index story_versions_story_status_idx on public.story_versions(story_id, status);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  story_id uuid references public.stories(id) on delete cascade,
  kind text not null check (kind in ('cover', 'event', 'avatar', 'result', 'other')),
  storage_path text not null unique,
  alt_text text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint assets_metadata_object check (jsonb_typeof(metadata) = 'object')
);

create index assets_story_id_idx on public.assets(story_id);

create table public.playthroughs (
  id uuid primary key default gen_random_uuid(),
  story_version_id uuid not null references public.story_versions(id) on delete restrict,
  player_id uuid references public.profiles(id) on delete set null,
  anonymous_token_hash text,
  status text not null default 'active' check (status in ('active', 'completed', 'abandoned')),
  current_node_id text,
  world_state jsonb not null default '{}'::jsonb,
  score_state jsonb not null default '{}'::jsonb,
  seed bigint not null,
  public_slug text unique,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint playthroughs_owner_check check (player_id is not null or anonymous_token_hash is not null),
  constraint playthroughs_world_state_object check (jsonb_typeof(world_state) = 'object'),
  constraint playthroughs_score_state_object check (jsonb_typeof(score_state) = 'object'),
  constraint playthroughs_completed_date check (status <> 'completed' or completed_at is not null)
);

create index playthroughs_player_updated_idx on public.playthroughs(player_id, updated_at desc);
create index playthroughs_story_version_idx on public.playthroughs(story_version_id);

create table public.decisions (
  id uuid primary key default gen_random_uuid(),
  playthrough_id uuid not null references public.playthroughs(id) on delete cascade,
  sequence integer not null check (sequence >= 0),
  node_id text not null,
  choice_id text not null,
  state_before jsonb not null,
  state_after jsonb not null,
  decided_at timestamptz not null default now(),
  constraint decisions_playthrough_sequence_unique unique (playthrough_id, sequence),
  constraint decisions_state_before_object check (jsonb_typeof(state_before) = 'object'),
  constraint decisions_state_after_object check (jsonb_typeof(state_after) = 'object')
);

create index decisions_playthrough_idx on public.decisions(playthrough_id, sequence);

create table public.reactions (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  story_id uuid not null references public.stories(id) on delete cascade,
  kind text not null check (kind in ('like', 'insightful', 'wild')),
  created_at timestamptz not null default now(),
  primary key (profile_id, story_id, kind)
);

create table public.bookmarks (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  story_id uuid not null references public.stories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, story_id)
);

create table public.remixes (
  parent_story_id uuid not null references public.stories(id) on delete restrict,
  child_story_id uuid not null unique references public.stories(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (parent_story_id, child_story_id),
  constraint remixes_no_self_reference check (parent_story_id <> child_story_id)
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  created_at timestamptz not null default now(),
  constraint tags_slug_format check (slug ~ '^[a-z0-9][a-z0-9-]{0,79}$')
);

create table public.story_tags (
  story_id uuid not null references public.stories(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (story_id, tag_id)
);

create index story_tags_tag_id_idx on public.story_tags(tag_id);

alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.story_versions enable row level security;
alter table public.assets enable row level security;
alter table public.playthroughs enable row level security;
alter table public.decisions enable row level security;
alter table public.reactions enable row level security;
alter table public.bookmarks enable row level security;
alter table public.remixes enable row level security;
alter table public.tags enable row level security;
alter table public.story_tags enable row level security;

comment on table public.story_versions is
  'Immutable published story snapshots. The content column must conform to the application story schema.';
comment on column public.playthroughs.story_version_id is
  'Pins a playthrough to the exact story version used when the session began.';
comment on column public.playthroughs.seed is
  'Makes generated events and final timelines deterministic and reproducible.';

commit;
