import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// publishable key only — safe for the browser (RLS enforces what anon can do).
// passkey: true opts into the experimental WebAuthn API (registerPasskey /
// signInWithPasskey) used by the /admin login.
export const supabase = createClient(url, key, {
  auth: { experimental: { passkey: true } },
});
