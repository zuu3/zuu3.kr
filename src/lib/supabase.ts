import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// publishable key only — safe for the browser (RLS enforces what anon can do).
export const supabase = createClient(url, key);
