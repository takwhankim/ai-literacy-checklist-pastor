import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 72px",
          background: "#eef2ff",
          color: "#1e3a8a"
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 700, marginBottom: 14 }}>교회사역자를 위한</div>
        <div style={{ fontSize: 96, lineHeight: 1.02, fontWeight: 900 }}>AI리터러시 체크리스트</div>
        <div style={{ marginTop: 32, fontSize: 26, color: "#334155" }}>
          사역자 AI리터러시 체크리스트
        </div>
        <div style={{ marginTop: 12, fontSize: 22, color: "#64748b" }}>© 2026 onmam.com. All rights reserved.</div>
      </div>
    ),
    {
      ...size
    }
  );
}
