export function formatBlogDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// 한글 기준 분당 약 350자 읽기 속도로 추정.
export function readingTime(paragraphs: string[]) {
  const chars = paragraphs.join("").length;
  return Math.max(1, Math.round(chars / 350));
}
