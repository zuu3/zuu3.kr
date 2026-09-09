import { BlogThemeToggle } from "./blog-theme-toggle";

// /blog 아래 전체(목록, 글, 미리보기)를 다크모드 스코프로 감싼다. 값
// 자체는 globals.css의 .blog-scope CSS 변수가 갖고 있고, 토글은
// data-theme 속성만 바꾼다 - admin은 이 레이아웃 밖이라 영향 없다.
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="blog-scope" suppressHydrationWarning>
      {children}
      <BlogThemeToggle />
    </div>
  );
}
