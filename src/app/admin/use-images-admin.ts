"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type StorageImage = { name: string; url: string; createdAt: string | null };

// post-images 버킷에 쌓인 파일 목록 + 삭제만 책임진다. 업로드는
// use-image-upload.ts 쪽 관심사라 여기 안 들어온다.
export function useImagesAdmin() {
  const [images, setImages] = useState<StorageImage[]>([]);
  const [loading, setLoading] = useState(true);

  function reload() {
    supabase.storage
      .from("post-images")
      .list("", { sortBy: { column: "created_at", order: "desc" } })
      .then(({ data }) => {
        const files = (data ?? []).filter((f) => f.name !== ".emptyFolderPlaceholder");
        setImages(
          files.map((f) => ({
            name: f.name,
            url: supabase.storage.from("post-images").getPublicUrl(f.name).data.publicUrl,
            createdAt: f.created_at,
          })),
        );
        setLoading(false);
      });
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(name: string) {
    const { error } = await supabase.storage.from("post-images").remove([name]);
    if (!error) setImages((prev) => prev.filter((i) => i.name !== name));
    return error;
  }

  return { images, loading, remove };
}
