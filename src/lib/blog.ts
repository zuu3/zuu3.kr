export function formatBlogDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// 코드블록과 마크다운 문법 기호를 뺀 순수 텍스트 기준, 한글 분당 약 500자
// 읽기 속도로 추정. 코드블록까지 포함해서 세면 실제 체감보다 훨씬 길게
// 나온다(예: 6600자 글이 19분으로 계산됨).
export function readingTime(content: string) {
  const plain = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#*_>`[\]()!-]/g, "");
  return Math.max(1, Math.round(plain.length / 500));
}
