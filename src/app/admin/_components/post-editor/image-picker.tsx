"use client";

import { useState } from "react";
import { ImagePlus, Link2 } from "lucide-react";
import { toss } from "@/app/blog/toss-tokens";

// 파일 업로드 vs 이미 웹에 있는 이미지 URL 붙여넣기, 두 선택지를 준다.
// 이전엔 버튼 클릭 = 바로 파일 선택창이라 URL 하나 있는 이미지도 무조건
// 로컬에 저장했다가 올려야 했다.
export function ImagePicker({
  uploading,
  onUploadFile,
  onInsertUrl,
  onClose,
}: {
  uploading: boolean;
  onUploadFile: (file: File) => void;
  onInsertUrl: (url: string, alt: string) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"choose" | "url">("choose");
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  return (
    <div className="absolute top-full left-0 z-10 mt-1 w-64 rounded-md border border-neutral-200 bg-white p-3 shadow-lg">
      {mode === "choose" ? (
        <div className="flex flex-col gap-1">
          <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
            <ImagePlus size={15} strokeWidth={1.75} />
            {uploading ? "업로드 중..." : "파일 업로드"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUploadFile(file);
                e.target.value = "";
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => setMode("url")}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            <Link2 size={15} strokeWidth={1.75} />
            URL로 추가
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <input
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm outline-none focus:border-neutral-400"
          />
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="설명 (alt, 선택)"
            className="rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm outline-none focus:border-neutral-400"
          />
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-1.5 text-xs font-medium text-neutral-500 hover:bg-neutral-100"
            >
              취소
            </button>
            <button
              type="button"
              disabled={!url.trim()}
              onClick={() => onInsertUrl(url.trim(), alt.trim())}
              className="rounded-md px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
              style={{ backgroundColor: toss.color.primary }}
            >
              추가
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
