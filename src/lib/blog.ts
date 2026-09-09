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

// 목록에서 별도 대표 이미지 필드 없이, 본문에 실제로 넣은 첫 번째 이미지를
// 썸네일로 쓴다(Ghost가 하는 방식). 코드블록 안에 있는 이미지 문법 예시는
// 실제 이미지가 아니니 먼저 걷어내고 찾는다.
export function firstImageUrl(content: string): string | null {
  const withoutCode = content.replace(/```[\s\S]*?```/g, "");
  const match = withoutCode.match(/!\[[^\]]*\]\(([^)]+)\)/);
  return match ? match[1] : null;
}
