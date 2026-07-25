import { ImageResponse } from "next/og"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

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
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "Geist, system-ui, sans-serif",
          padding: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: 24,
            background: "#fafafa",
            color: "#0a0a0a",
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 32,
          }}
        >
          23
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.04em" }}>
          23rd Docs
        </div>
        <div style={{ fontSize: 28, color: "#a1a1aa", marginTop: 16 }}>
          Documentation and guides
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
