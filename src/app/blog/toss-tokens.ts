// Toss(토스) 레퍼런스 기반 토큰. design-references/toss.md 참고, blog 전용 스코프.
// 메인 포트폴리오 DESIGN.md(카럿 오렌지 accent)와 별도 시스템 — 이 파일 밖에서 쓰지 않는다.
// 값이 hex가 아니라 CSS 변수인 이유: 다크모드. .blog-scope(globals.css)
// 안에서 이 변수들이 라이트/다크로 갈라진다. 이 파일 쓰는 컴포넌트는
// 전부 style={{ color: toss.color.foreground }} 식으로 값을 그대로
// 박아넣기 때문에, 변수를 바꾸는 것만으로 다크모드가 전체에 퍼진다.
export const toss = {
  color: {
    primary: "var(--blog-primary)",
    primaryHover: "var(--blog-primary-hover)",
    primaryRing: "var(--blog-primary-ring)", // focus-ring 등 알파 포함 색 - var()+hex suffix 문자열 결합 불가라 별도 토큰
    canvas: "var(--blog-canvas)",
    foreground: "var(--blog-foreground)",
    body: "var(--blog-body)",
    muted: "var(--blog-muted)",
    surface: "var(--blog-surface)",
    border: "var(--blog-border)",
    weakBg: "var(--blog-weak-bg)",
    weakFg: "var(--blog-weak-fg)",
  },
  radius: {
    sm: "4px",
    md: "6px",
  },
  spacing: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
  },
} as const;
