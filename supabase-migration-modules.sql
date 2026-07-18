-- Run this once in the Supabase SQL editor to add module support to the
-- existing scores table (adds a "module" column; existing rows default
-- to 'algemeen' since they predate the module split).

alter table public.scores
  add column module text not null default 'algemeen' check (char_length(module) <= 24);

create index scores_module_score_idx on public.scores (module, score desc, created_at asc);
