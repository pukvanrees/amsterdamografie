import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If env vars aren't set (e.g. local dev before Supabase is configured),
// score saving/leaderboard features degrade gracefully instead of crashing.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
