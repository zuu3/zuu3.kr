// Toss(토스) 레퍼런스 기반 토큰. design-references/toss.md 참고, blog 전용 스코프.
// 메인 포트폴리오 DESIGN.md(카럿 오렌지 accent)와 별도 시스템 — 이 파일 밖에서 쓰지 않는다.
export const toss = {
  color: {
    primary: "#3182f6",
    primaryHover: "#2272eb",
    canvas: "#ffffff",
    foreground: "#191f28",
    body: "#4e5968",
    muted: "#8b95a1",
    surface: "#f2f4f6",
    border: "#e5e8eb",
    weakBg: "#e8f3ff",
    weakFg: "#1b64da",
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
