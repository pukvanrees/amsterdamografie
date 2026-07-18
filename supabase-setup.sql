-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query)
-- to create the scores table used by the Amsterdamografie quiz.

create table public.scores (
  id uuid primary key default gen_random_uuid(),
  nickname text not null check (char_length(nickname) between 1 and 24),
  score integer not null check (score >= 0),
  total integer not null check (total > 0 and score <= total),
  category text not null default 'all' check (char_length(category) <= 24),
  created_at timestamptz not null default now()
);

alter table public.scores enable row level security;

-- The app has no login system, so anyone can submit a score (same trust
-- level as any other browser-based leaderboard without auth) and everyone
-- can read the leaderboard.
create policy "Anyone can read scores"
  on public.scores for select
  using (true);

create policy "Anyone can insert scores"
  on public.scores for insert
  with check (true);
