import { supabase } from "./supabase";

export async function saveScore({ nickname, score, total, category }) {
  if (!supabase) return { error: "Supabase not configured" };
  const { error } = await supabase
    .from("scores")
    .insert({ nickname, score, total, category });
  return { error: error?.message ?? null };
}

export async function fetchTopScores(limit = 10) {
  if (!supabase) return { scores: [], error: "Supabase not configured" };
  const { data, error } = await supabase
    .from("scores")
    .select("nickname, score, total, category, created_at")
    .order("score", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(limit);
  return { scores: data ?? [], error: error?.message ?? null };
}
