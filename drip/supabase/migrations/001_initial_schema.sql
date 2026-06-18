-- Drip initial Supabase schema.
-- Apply with `supabase db push` after linking a project.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  timezone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.drip_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  description text,
  is_premium boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.drips (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.drip_categories(id) on delete restrict,
  title text,
  body text not null check (char_length(body) between 2 and 500),
  author text,
  source text not null default 'curated' check (source in ('curated', 'ai')),
  is_active boolean not null default true,
  is_premium boolean not null default false,
  safety_status text not null default 'approved' check (safety_status in ('draft', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_drip_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  drip_id uuid not null references public.drips(id) on delete cascade,
  opened_at timestamptz not null default now(),
  date_key date not null default current_date,
  is_primary_daily boolean not null default false
);

create table if not exists public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  drip_id uuid not null references public.drips(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, drip_id)
);

create table if not exists public.user_streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_opened_date date,
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revenuecat_customer_id text,
  plan text not null default 'free' check (plan in ('free', 'premium_monthly', 'premium_yearly', 'lifetime')),
  status text not null default 'inactive' check (status in ('inactive', 'trialing', 'active', 'cancelled', 'expired')),
  entitlement text,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.share_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  drip_id uuid references public.drips(id) on delete set null,
  channel text,
  created_at timestamptz not null default now()
);

create table if not exists public.feedback_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  drip_id uuid references public.drips(id) on delete set null,
  rating integer check (rating between 1 and 5),
  feedback_type text,
  comment text check (comment is null or char_length(comment) <= 1000),
  created_at timestamptz not null default now()
);

create unique index if not exists one_primary_daily_drip_per_user_day
  on public.user_drip_history(user_id, date_key)
  where is_primary_daily = true;

create index if not exists drips_category_active_idx on public.drips(category_id, is_active);
create index if not exists history_user_opened_idx on public.user_drip_history(user_id, opened_at desc);
create index if not exists favorites_user_created_idx on public.user_favorites(user_id, created_at desc);
create index if not exists share_events_user_created_idx on public.share_events(user_id, created_at desc);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists drips_set_updated_at on public.drips;
create trigger drips_set_updated_at
before update on public.drips
for each row execute function public.set_updated_at();

drop trigger if exists user_streaks_set_updated_at on public.user_streaks;
create trigger user_streaks_set_updated_at
before update on public.user_streaks
for each row execute function public.set_updated_at();

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.drip_categories enable row level security;
alter table public.drips enable row level security;
alter table public.user_drip_history enable row level security;
alter table public.user_favorites enable row level security;
alter table public.user_streaks enable row level security;
alter table public.subscriptions enable row level security;
alter table public.share_events enable row level security;
alter table public.feedback_events enable row level security;

create policy "users can read own user row"
on public.users for select
using (auth.uid() = id);

create policy "users can insert own user row"
on public.users for insert
with check (auth.uid() = id);

create policy "profiles are readable by owner"
on public.profiles for select
using (auth.uid() = user_id);

create policy "profiles are insertable by owner"
on public.profiles for insert
with check (auth.uid() = user_id);

create policy "profiles are updatable by owner"
on public.profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "active categories are public"
on public.drip_categories for select
using (true);

create policy "active approved drips are public"
on public.drips for select
using (is_active = true and safety_status = 'approved');

create policy "history is readable by owner"
on public.user_drip_history for select
using (auth.uid() = user_id);

create policy "history is insertable by owner"
on public.user_drip_history for insert
with check (auth.uid() = user_id);

create policy "favorites are readable by owner"
on public.user_favorites for select
using (auth.uid() = user_id);

create policy "favorites are insertable by owner"
on public.user_favorites for insert
with check (auth.uid() = user_id);

create policy "favorites are deletable by owner"
on public.user_favorites for delete
using (auth.uid() = user_id);

create policy "streaks are readable by owner"
on public.user_streaks for select
using (auth.uid() = user_id);

create policy "streaks are insertable by owner"
on public.user_streaks for insert
with check (auth.uid() = user_id);

create policy "streaks are updatable by owner"
on public.user_streaks for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "subscriptions are readable by owner"
on public.subscriptions for select
using (auth.uid() = user_id);

create policy "share events are insertable by owner"
on public.share_events for insert
with check (auth.uid() = user_id or user_id is null);

create policy "feedback events are insertable by owner"
on public.feedback_events for insert
with check (auth.uid() = user_id or user_id is null);

insert into public.drip_categories (slug, label, description, sort_order)
values
  ('happy', 'Happy', 'Mood-lifting drips that make the day feel lighter.', 10),
  ('grateful', 'Grateful', 'Drips that help users notice what is already good.', 20),
  ('wise', 'Wise', 'Short insights and lessons.', 30),
  ('challenge', 'Challenge', 'Small actions that move the user forward.', 40),
  ('curious', 'Curious', 'Questions and facts that spark curiosity.', 50),
  ('deep', 'Deep', 'Reflective prompts for meaningful moments.', 60),
  ('action', 'Action', 'Concrete productivity and social micro-actions.', 70)
on conflict (slug) do nothing;
