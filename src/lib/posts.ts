import { supabase } from "@/lib/supabase";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  content: string;
  published_at: string;
  status: "draft" | "published";
};

// 공개 블로그(이 파일)는 published만 노출한다. RLS도 anon 쪽에서 이미
// 막아두긴 했지만, 여기 코드만 보고도 "공개 목록엔 draft가 안 나온다"는
// 걸 알 수 있게 명시적으로 필터한다 - RLS 하나에만 기대지 않는다.
export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("slug, title, excerpt, tags, content, published_at, status")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("slug, title, excerpt, tags, content, published_at, status")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data;
}
