import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 사이트 전역 기본 OG 이미지는 어떤 글을 공유해도 똑같은 썸네일이 뜬다.
// 글마다 제목이 들어간 이미지를 따로 만들면 카톡/트위터 공유 시 어떤
// 글인지 미리 알 수 있다. 블로그는 별도 Toss 톤 스코프라 카럿 오렌지
// 대신 토스 블루를 쓴다 (src/app/blog/toss-tokens.ts와 같은 값).
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post?.title ?? "오주현 | 프론트엔드 기록";
  const tags = post?.tags ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0b0b12",
          padding: "90px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "#3182f6",
            opacity: 0.25,
            filter: "blur(140px)",
            right: -150,
            bottom: -200,
          }}
        />
        <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#3182f6", letterSpacing: -0.5 }}>
          BLOG
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 22 ? 60 : 76,
            fontWeight: 800,
            color: "#ffffff",
            marginTop: 24,
            maxWidth: 1000,
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        {tags.length > 0 && (
          <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
            {tags.slice(0, 3).map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  fontSize: 24,
                  color: "#a3a3a3",
                  border: "1px solid #2a2a35",
                  borderRadius: 999,
                  padding: "8px 20px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    { ...size },
  );
}
