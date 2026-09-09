"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AdminComment = {
  id: string;
  post_slug: string;
  nickname: string;
  body: string;
  created_at: string;
};

// 댓글 목록 로딩 + 삭제만 책임진다. 어떤 UI로 보여줄지는 쓰는 쪽 몫.
export function useCommentsAdmin() {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(true);

  function reload() {
    supabase
      .from("comments")
      .select("id, post_slug, nickname, body, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setComments(data ?? []);
        setLoading(false);
      });
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(id: string) {
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (!error) setComments((prev) => prev.filter((c) => c.id !== id));
    return error;
  }

  return { comments, loading, reload, remove };
}
