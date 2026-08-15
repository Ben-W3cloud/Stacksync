import { ImageResponse } from "next/og";

export const alt = "StackSync — Master Production Code & On-Chain Apps";
export const size = { width: 1200, height: 630 };
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
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0a14",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#a78bfa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0d0a14",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            S
          </div>
          <span style={{ fontSize: 48, fontWeight: 800, color: "#f4f1fb" }}>StackSync</span>
        </div>
        <p
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#f4f1fb",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          Master Production Code &{" "}
          <span style={{ color: "#a78bfa" }}>On-Chain Apps</span>
        </p>
        <p style={{ fontSize: 22, color: "#a89fc2", marginTop: 16 }}>
          Web2 + Web3 gamified learning
        </p>
      </div>
    ),
    { ...size },
  );
}
