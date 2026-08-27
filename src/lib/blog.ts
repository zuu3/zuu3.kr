export function formatBlogDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// 한글 기준 분당 약 350자 읽기 속도로 추정.
export function readingTime(paragraphs: string[]) {
  const chars = paragraphs.join("").length;
  return Math.max(1, Math.round(chars / 350));
}

const TAG_TONES = ["brand", "informative", "positive", "neutral"] as const;

// 태그 문자열 해시로 톤을 고정 배정 — 같은 태그는 항상 같은 색.
export function tagTone(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  return TAG_TONES[hash % TAG_TONES.length];
}
