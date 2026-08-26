import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "오주현 | 스펀지 같은 개발자";

export default function Image() {
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
            background: "#0cefd3",
            opacity: 0.25,
            filter: "blur(140px)",
            right: -150,
            bottom: -200,
          }}
        />
        <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#0cefd3", letterSpacing: -0.5 }}>
          Frontend Engineer
        </div>
        <div style={{ display: "flex", fontSize: 128, fontWeight: 900, color: "#ffffff", marginTop: 20 }}>
          오주현
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#a3a3a3", marginTop: 28, maxWidth: 900 }}>
          스펀지 같은 개발자, 오주현입니다.
        </div>
      </div>
    ),
    { ...size },
  );
}
