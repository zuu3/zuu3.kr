"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

// post-images 버킷 업로드만 책임진다. 업로드 성공 시 공개 URL을 돌려주고,
// 그걸 본문 어디에 어떻게 넣을지는 호출한 쪽(usePostForm의 replaceSelection)
// 몫으로 남겨둔다 - 업로드와 "본문 편집"은 같이 바뀔 이유가 없는 별개
// 관심사다.
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File): Promise<string | null> {
    setUploading(true);
    setError(null);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from("post-images").upload(path, file);
    setUploading(false);
    if (error) {
      setError(error.message);
      return null;
    }
    const { data } = supabase.storage.from("post-images").getPublicUrl(path);
    return data.publicUrl;
  }

  return { uploading, error, upload };
}
