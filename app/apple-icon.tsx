import { ImageResponse } from "next/og"

export const size = {
  width: 180,
  height: 180,
}

export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
        }}
      >
        <svg
          width="160"
          height="160"
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
    ),
    {
      ...size,
    }
  )
}
