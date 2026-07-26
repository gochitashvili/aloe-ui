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
            width: 120,
            height: 120,
            marginBottom: 32,
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="200" height="200" rx="11" fill="white" />
            <path
              d="M21.5 30H163.5L21.5 128.5L177.5 96.5V136.5V186H21.5"
              stroke="black"
              strokeWidth="8"
            />
            <path d="M70 7H90V192H70V7Z" fill="black" />
            <path d="M110 7H130V192H110V7Z" fill="black" />
          </svg>
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.04em" }}>
          23rd
        </div>
        <div style={{ fontSize: 28, color: "#a1a1aa", marginTop: 16 }}>
          Opinionated components for shippers
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
