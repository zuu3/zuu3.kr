export type TocHeading = { level: 2 | 3 | 4; text: string; id: string };

// BlogMarkdown이 렌더링하는 h2/h3/h4 순서와 동일한 순서로 훑어 같은 id(heading-N)를
// 만든다 — 두 곳이 서로 다른 파서를 쓰지만 마크다운을 위→아래로 한 번만 읽으므로
// 인덱스가 항상 맞아떨어진다.
export function extractHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = markdown.split("\n");
  let index = 0;
  for (const line of lines) {
    const h2 = /^##\s+(.+)/.exec(line);
    const h3 = /^###\s+(.+)/.exec(line);
    const h4 = /^####\s+(.+)/.exec(line);
    if (h2) {
      headings.push({ level: 2, text: h2[1].trim(), id: `heading-${index}` });
      index++;
    } else if (h3) {
      headings.push({ level: 3, text: h3[1].trim(), id: `heading-${index}` });
      index++;
    } else if (h4) {
      headings.push({ level: 4, text: h4[1].trim(), id: `heading-${index}` });
      index++;
    }
  }
  return headings;
}
