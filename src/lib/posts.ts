import { supabase } from "@/lib/supabase";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  content: string;
  published_at: string;
};

export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("slug, title, excerpt, tags, content, published_at")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("slug, title, excerpt, tags, content, published_at")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}
