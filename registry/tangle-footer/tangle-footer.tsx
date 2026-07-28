"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

export type TangleFooterProps = {
  className?: string
  /** Phrases sampled randomly onto rings. */
  lines?: string[]
  /**
   * Ribbon (stroke) color. Omit for theme-aware defaults
   * (near-black in light, soft cream in dark).
   */
  ribbon?: string
  /**
   * Text fill on the ribbons. Omit for theme-aware defaults
   * (cream in light, near-black in dark).
   */
  textColor?: string
  /**
   * Field behind the rings. Omit for theme-aware defaults
   * (warm cream in light, near-black in dark). Pass `"transparent"`
   * when the parent already paints the stage.
   */
  background?: string
  /**
   * Band height in px. Omit to use half the measured width
   * (upper semicircle of a full-width nest).
   */
  height?: number
  /** Seed for random line / marquee assignment across rings. */
  seed?: number
  /** Accessible label. */
  label?: string
}

const DEFAULT_LINES = [
  "Ship something opinionated — less boilerplate, clearer decisions.",
  "Knows what’s going on. Can you check in with them and see what’s next.",
  "The new timeline should be ready by Friday, although it’s probably going to slip.",
  "Open the docs, grab a component, and make it yours in the codebase.",
  "Radiant lines, shader wash, gooey picker — install what you need and move.",
]

type Ring = {
  d: string
  strokeWidth: number
  fontSize: number
  text: string
  /** Initial rotation phase in degrees (0–360). */
  phase: number
  /** Seconds for one full 360° revolution. */
  drift: number
  reverse: boolean
}

const RING_COUNT = 5

const K = 0.5522847498
const STROKE = 28

/** Mulberry32 — deterministic PRNG so rings stay stable across re-renders. */
function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/** Perfect circle as four cubics (container clips to the upper half). */
function circlePath(cx: number, cy: number, r: number): string {
  const o = r * K
  return [
    `M ${(cx + r).toFixed(1)} ${cy.toFixed(1)}`,
    `C ${(cx + r).toFixed(1)} ${(cy + o).toFixed(1)} ${(cx + o).toFixed(1)} ${(cy + r).toFixed(1)} ${cx.toFixed(1)} ${(cy + r).toFixed(1)}`,
    `C ${(cx - o).toFixed(1)} ${(cy + r).toFixed(1)} ${(cx - r).toFixed(1)} ${(cy + o).toFixed(1)} ${(cx - r).toFixed(1)} ${cy.toFixed(1)}`,
    `C ${(cx - r).toFixed(1)} ${(cy - o).toFixed(1)} ${(cx - o).toFixed(1)} ${(cy - r).toFixed(1)} ${cx.toFixed(1)} ${(cy - r).toFixed(1)}`,
    `C ${(cx + o).toFixed(1)} ${(cy - r).toFixed(1)} ${(cx + r).toFixed(1)} ${(cy - o).toFixed(1)} ${(cx + r).toFixed(1)} ${cy.toFixed(1)}`,
  ].join(" ")
}

function buildRingText(line: string, other: string, mix: boolean): string {
  const unit = mix
    ? `${line}   ·   ${other}   ·   `
    : `${line}   ·   ${line}   ·   ${other}   ·   `
  // Repeat so the circumference stays filled under rotation
  return unit.repeat(8)
}

/**
 * Five concentric circles spanning the full width.
 * Each ring picks a random phrase + phase so they don’t match.
 */
function buildRings(
  width: number,
  bandHeight: number,
  lines: string[],
  seed: number
): Ring[] {
  const rand = mulberry32(seed)
  const cx = width / 2
  const cy = bandHeight
  const strokePad = STROKE / 2 + 2
  const outer = Math.max(width / 2 - strokePad, STROKE * 4)
  const radii = Array.from(
    { length: RING_COUNT },
    (_, i) => (outer * (i + 1)) / RING_COUNT
  )

  const fontSize = Math.min(24, Math.max(16, width * 0.022))
  const pool = lines.length > 0 ? lines : DEFAULT_LINES

  return radii.map((r, i) => {
    const line = pool[Math.floor(rand() * pool.length)]!
    const other = pool[Math.floor(rand() * pool.length)]!

    return {
      d: circlePath(cx, cy, r),
      strokeWidth: STROKE,
      fontSize,
      text: buildRingText(line, other, rand() > 0.45),
      phase: rand() * 360,
      // Outer rings travel farther — slightly slower for even visual pace
      drift: 28 + rand() * 24,
      // Alternate direction each ring (inner → outer)
      reverse: i % 2 === 1,
    }
  })
}

/**
 * Footer of five nested text rings — full-width upper semicircle.
 * Each ring spins a full 360° around the nest center (seamless CSS loop).
 */
export function TangleFooter({
  className,
  lines = DEFAULT_LINES,
  ribbon,
  textColor,
  background,
  height,
  seed = 23,
  label = "Site footer",
}: TangleFooterProps) {
  const reduce = useReducedMotion() ?? false
  const uid = useId().replace(/:/g, "")
  const rootRef = useRef<HTMLElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const measure = () => {
      setWidth(el.clientWidth)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const bandHeight = height ?? (width > 0 ? width / 2 : 0)
  const cx = width / 2
  const cy = bandHeight
  const rings = useMemo(
    () =>
      width > 0 && bandHeight > 0
        ? buildRings(width, bandHeight, lines, seed)
        : [],
    [width, bandHeight, lines, seed]
  )

  return (
    <footer
      ref={rootRef}
      data-slot="tangle-footer"
      aria-label={label}
      className={cn(
        "relative w-full overflow-hidden",
        // Theme tokens — skipped when explicit color props are passed
        background === undefined && "bg-[#EFEAE2] dark:bg-[#121210]",
        ribbon == null &&
          "[--tangle-ribbon:#141414] dark:[--tangle-ribbon:#E8E4DC]",
        textColor == null &&
          "[--tangle-text:#F4F0E8] dark:[--tangle-text:#161616]",
        className
      )}
      style={{
        background,
        height: bandHeight > 0 ? bandHeight : undefined,
        aspectRatio: height == null ? "2 / 1" : undefined,
      }}
    >
      {width > 0 && bandHeight > 0 ? (
        <motion.svg
          className="absolute inset-0 size-full"
          viewBox={`0 0 ${width} ${bandHeight}`}
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {rings.map((ring, i) => {
            const pathId = `${uid}-path-${i}`
            const from = `${ring.phase} ${cx} ${cy}`
            const to = `${ring.phase + (ring.reverse ? -360 : 360)} ${cx} ${cy}`

            return (
              <g
                key={`ring-${i}`}
                // Static pose when motion is reduced; otherwise SMIL owns transform
                transform={reduce ? `rotate(${ring.phase} ${cx} ${cy})` : undefined}
              >
                {!reduce ? (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={from}
                    to={to}
                    dur={`${ring.drift}s`}
                    repeatCount="indefinite"
                    calcMode="linear"
                  />
                ) : null}
                <path
                  id={pathId}
                  d={ring.d}
                  stroke={ribbon ?? "var(--tangle-ribbon)"}
                  strokeWidth={ring.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <text
                  fill={textColor ?? "var(--tangle-text)"}
                  fontSize={ring.fontSize}
                  fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
                  fontWeight={700}
                  letterSpacing="0.05em"
                  dominantBaseline="central"
                  style={{ userSelect: "none" }}
                >
                  <textPath href={`#${pathId}`} startOffset="0%" method="align">
                    {ring.text}
                  </textPath>
                </text>
              </g>
            )
          })}
        </motion.svg>
      ) : null}

      <p className="sr-only">{lines.join(" ")}</p>
    </footer>
  )
}
