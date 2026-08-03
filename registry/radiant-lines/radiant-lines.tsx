"use client"

import { useEffect, useRef, type RefObject } from "react"
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useVelocity,
} from "motion/react"

import { cn } from "@/lib/utils"

export type RadiantLinesProps = {
  className?: string
  /** Star / streak colors */
  colors?: string[]
  /** How many stars. Default 420 */
  starCount?: number
  /**
   * Scroll container. Omit to use the window.
   * Pass a ref when the component lives inside an overflow scroller.
   */
  containerRef?: RefObject<HTMLElement | null>
}

type Star = {
  x: number
  y: number
  z: number
  pz: number
  color: string
}

const DEFAULT_COLORS = [
  "#FF6B4A",
  "#2DD4BF",
  "#FBBF24",
  "#60A5FA",
  "#F472B6",
  "#A3E635",
  "#94A3B8",
]

const DEPTH = 1000

function createStars(count: number, colors: string[]): Star[] {
  const stars: Star[] = []
  for (let i = 0; i < count; i++) {
    const z = Math.random() * DEPTH
    stars.push({
      x: (Math.random() - 0.5) * DEPTH,
      y: (Math.random() - 0.5) * DEPTH,
      z,
      pz: z,
      color: colors[i % colors.length]!,
    })
  }
  return stars
}

/**
 * Hyperspace starfield — colored streaks radiate from the center.
 * Transparent canvas over `bg-background` (shadcn theme).
 */
export function RadiantLines({
  className,
  colors = DEFAULT_COLORS,
  starCount = 420,
  containerRef,
}: RadiantLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const rafRef = useRef(0)
  const sizeRef = useRef({ w: 0, h: 0 })
  const speedRef = useRef(0.28)
  const dirRef = useRef(-1)
  const reduce = useReducedMotion() ?? false

  const { scrollY } = useScroll(
    containerRef ? { container: containerRef } : undefined
  )
  const scrollVelocity = useVelocity(scrollY)
  const warp = useSpring(0.28, { stiffness: 70, damping: 32, mass: 0.5 })

  useMotionValueEvent(scrollVelocity, "change", (v) => {
    if (reduce) {
      warp.set(0.06)
      dirRef.current = -1
      return
    }
    // Flipped: scroll down → inward; scroll up → outward
    if (Math.abs(v) > 2) {
      dirRef.current = v > 0 ? 1 : -1
    }
    const boost = Math.min(8, Math.abs(v) / 80)
    warp.set(0.22 + boost)
  })

  useMotionValueEvent(warp, "change", (v) => {
    speedRef.current = v
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    starsRef.current = createStars(starCount, colors)

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = parent.clientWidth
      const h = parent.clientHeight
      sizeRef.current = { w, h }
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    let running = true

    const tick = () => {
      if (!running) return
      const { w, h } = sizeRef.current
      if (w === 0 || h === 0) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const cx = w / 2
      const cy = h / 2
      const speed = reduce ? 0.05 : speedRef.current
      const dir = dirRef.current
      const focal = Math.max(w, h) * 0.5
      const stars = starsRef.current

      // Transparent — CSS bg-background shows through
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]!
        star.pz = star.z
        star.z -= dir * speed * 2.4

        if (star.z <= 1) {
          star.z = DEPTH
          star.pz = DEPTH
          star.x = (Math.random() - 0.5) * DEPTH
          star.y = (Math.random() - 0.5) * DEPTH
          star.color = colors[Math.floor(Math.random() * colors.length)]!
        } else if (star.z >= DEPTH) {
          star.z = 1.5
          star.pz = 1.5
          star.x = (Math.random() - 0.5) * DEPTH
          star.y = (Math.random() - 0.5) * DEPTH
          star.color = colors[Math.floor(Math.random() * colors.length)]!
        }

        const k = focal / star.z
        const x = cx + star.x * k
        const y = cy + star.y * k

        const pk = focal / star.pz
        const px = cx + star.x * pk
        const py = cy + star.y * pk

        if (
          (x < -50 && px < -50) ||
          (x > w + 50 && px > w + 50) ||
          (y < -50 && py < -50) ||
          (y > h + 50 && py > h + 50)
        ) {
          continue
        }

        const near = 1 - star.z / DEPTH
        const lineW = Math.max(0.8, near * (1.8 + speed * 0.12))
        const alpha = 0.35 + near * 0.65

        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(x, y)
        ctx.strokeStyle = star.color
        ctx.globalAlpha = alpha
        ctx.lineWidth = lineW
        ctx.lineCap = "round"
        ctx.stroke()

        if (near > 0.45) {
          ctx.beginPath()
          ctx.arc(x, y, lineW * 0.9, 0, Math.PI * 2)
          ctx.fillStyle = star.color
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [colors, reduce, starCount])

  return (
    <div
      data-slot="radiant-lines"
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-background",
        className
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  )
}
