import type { SVGProps } from "react"

type LogoProps = SVGProps<SVGSVGElement> & {
  cornerRadius?: number
}

export function Logo({ cornerRadius = 11, ...props }: LogoProps) {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="23rd logo"
      {...props}
    >
      <rect width="200" height="200" rx={cornerRadius} fill="white" />
      <path
        d="M21.5 30H163.5L21.5 128.5L177.5 96.5V136.5V186H21.5"
        stroke="black"
        strokeWidth="8"
      />
      <path d="M70 7H90V192H70V7Z" fill="black" />
      <path d="M110 7H130V192H110V7Z" fill="black" />
    </svg>
  )
}
