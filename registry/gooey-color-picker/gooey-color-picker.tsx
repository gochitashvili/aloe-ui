"use client"

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react"
import { RiCloseLine, RiDropFill } from "@remixicon/react"

import { cn } from "@/lib/utils"

export type GooeyColor = {
  h: number
  s: number
  l: number
  a: number
}

export type GooeyColorPickerProps = {
  value?: GooeyColor | string
  defaultValue?: GooeyColor | string
  onChange?: (color: GooeyColor, css: string) => void
  className?: string
  /** Accessible name for the trigger */
  label?: string
}

const DEFAULT_COLOR: GooeyColor = { h: 210, s: 90, l: 55, a: 1 }

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function toCss(color: GooeyColor) {
  return `hsla(${Math.round(color.h)} ${Math.round(color.s)}% ${Math.round(color.l)}% / ${Number(color.a.toFixed(3))})`
}

function parseColor(input?: GooeyColor | string): GooeyColor {
  if (!input) return { ...DEFAULT_COLOR }
  if (typeof input !== "string") {
    return {
      h: clamp(input.h, 0, 360),
      s: clamp(input.s, 0, 100),
      l: clamp(input.l, 0, 100),
      a: clamp(input.a, 0, 1),
    }
  }

  const hsla =
    input.match(
      /hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%(?:[\s,/]+([\d.]+)%?)?\s*\)/i
    ) ?? null
  if (hsla) {
    const aRaw = hsla[4] == null ? 1 : Number(hsla[4])
    return {
      h: clamp(Number(hsla[1]), 0, 360),
      s: clamp(Number(hsla[2]), 0, 100),
      l: clamp(Number(hsla[3]), 0, 100),
      a: clamp(aRaw > 1 ? aRaw / 100 : aRaw, 0, 1),
    }
  }

  const hex = input.trim().replace("#", "")
  if (/^[0-9a-f]{3,8}$/i.test(hex)) {
    const full =
      hex.length === 3 || hex.length === 4
        ? hex
            .split("")
            .map((c) => c + c)
            .join("")
        : hex
    const r = Number.parseInt(full.slice(0, 2), 16)
    const g = Number.parseInt(full.slice(2, 4), 16)
    const b = Number.parseInt(full.slice(4, 6), 16)
    const a =
      full.length >= 8 ? Number.parseInt(full.slice(6, 8), 16) / 255 : 1
    return { ...rgbToHsl(r, g, b), a: clamp(a, 0, 1) }
  }

  return { ...DEFAULT_COLOR }
}

function rgbToHsl(r: number, g: number, b: number): Omit<GooeyColor, "a"> {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: l * 100 }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  switch (max) {
    case rn:
      h = (gn - bn) / d + (gn < bn ? 6 : 0)
      break
    case gn:
      h = (bn - rn) / d + 2
      break
    default:
      h = (rn - gn) / d + 4
  }
  return { h: (h / 6) * 360, s: s * 100, l: l * 100 }
}

function angleFromPoint(x: number, y: number, cx: number, cy: number) {
  const rad = Math.atan2(y - cy, x - cx)
  const deg = (rad * 180) / Math.PI + 90
  return (deg + 360) % 360
}

function useControllableColor(
  value: GooeyColorPickerProps["value"],
  defaultValue: GooeyColorPickerProps["defaultValue"],
  onChange: GooeyColorPickerProps["onChange"]
) {
  const [uncontrolled, setUncontrolled] = useState(() =>
    parseColor(defaultValue ?? value)
  )
  const isControlled = value !== undefined
  const color = isControlled ? parseColor(value) : uncontrolled

  const setColor = useCallback(
    (next: GooeyColor) => {
      if (!isControlled) setUncontrolled(next)
      onChange?.(next, toCss(next))
    },
    [isControlled, onChange]
  )

  return [color, setColor] as const
}

export function GooeyColorPicker({
  value,
  defaultValue,
  onChange,
  className,
  label = "Color picker",
}: GooeyColorPickerProps) {
  const filterId = useId().replace(/:/g, "")
  const rootRef = useRef<HTMLDivElement>(null)
  const wheelRef = useRef<HTMLDivElement>(null)
  const alphaRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [color, setColor] = useControllableColor(value, defaultValue, onChange)
  const colorRef = useRef(color)
  colorRef.current = color
  const css = toCss(color)
  const opaque = toCss({ ...color, a: 1 })

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener("pointerdown", onPointerDown)
    return () => window.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  const updateHueFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const el = wheelRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const h = angleFromPoint(
        clientX,
        clientY,
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      )
      setColor({ ...colorRef.current, h, s: 90, l: 55 })
    },
    [setColor]
  )

  const updateAlphaFromPointer = useCallback(
    (clientX: number) => {
      const el = alphaRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const t = clamp((clientX - rect.left) / rect.width, 0, 1)
      setColor({ ...colorRef.current, a: t })
    },
    [setColor]
  )

  function bindDrag(
    onMove: (clientX: number, clientY: number) => void
  ) {
    return (event: ReactPointerEvent<HTMLElement>) => {
      event.preventDefault()
      const target = event.currentTarget
      target.setPointerCapture(event.pointerId)
      onMove(event.clientX, event.clientY)

      function move(e: PointerEvent) {
        onMove(e.clientX, e.clientY)
      }
      function up(e: PointerEvent) {
        window.removeEventListener("pointermove", move)
        window.removeEventListener("pointerup", up)
        try {
          target.releasePointerCapture(e.pointerId)
        } catch {
          // ignore
        }
      }
      window.addEventListener("pointermove", move)
      window.addEventListener("pointerup", up)
    }
  }

  const blobTransition =
    "transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease"

  return (
    <div
      ref={rootRef}
      data-slot="gooey-color-picker"
      data-open={open ? "true" : "false"}
      className={cn(
        "relative inline-flex h-72 w-44 items-end justify-center select-none",
        className
      )}
    >
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <filter
            id={`gooey-${filterId}`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Gooey fill layer — solid blobs that melt together */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ filter: `url(#gooey-${filterId})` }}
      >
        {/* Bottom-left swatch */}
        <div
          className="absolute bottom-0 left-[calc(50%-2.75rem)] size-12 rounded-full"
          style={{ background: css }}
        />
        {/* Bottom-right close — only when open */}
        <div
          className="absolute bottom-0 left-[calc(50%+0.25rem)] size-12 rounded-full bg-foreground"
          style={{
            opacity: open ? 1 : 0,
            transform: open
              ? "translate(0, 0) scale(1)"
              : "translate(-1.5rem, 0) scale(0.4)",
            transition: blobTransition,
          }}
        />
        {/* Alpha capsule */}
        <div
          className="absolute bottom-17 left-1/2 h-11 w-36 -translate-x-1/2 rounded-full"
          style={{
            background: css,
            opacity: open ? 1 : 0,
            transform: open
              ? "translate(-50%, 0) scale(1)"
              : "translate(-50%, 3.5rem) scale(0.35)",
            transition: blobTransition,
          }}
        />
        {/* Hue circle */}
        <div
          className="absolute bottom-33 left-1/2 size-36 -translate-x-1/2 rounded-full"
          style={{
            background: opaque,
            opacity: open ? 1 : 0,
            transform: open
              ? "translate(-50%, 0) scale(1)"
              : "translate(-50%, 7rem) scale(0.28)",
            transition: blobTransition,
          }}
        />
      </div>

      {/* Interactive layer */}
      <div className="relative z-10 size-full">
        {/* Hue wheel — top circle */}
        <div
          ref={wheelRef}
          role="slider"
          tabIndex={open ? 0 : -1}
          aria-label="Hue"
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={Math.round(color.h)}
          aria-hidden={!open}
          className={cn(
            "absolute bottom-33 left-1/2 size-36 -translate-x-1/2 touch-none rounded-full outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            !open && "pointer-events-none"
          )}
          style={{
            opacity: open ? 1 : 0,
            transform: open
              ? "translate(-50%, 0) scale(1)"
              : "translate(-50%, 7rem) scale(0.28)",
            transition: blobTransition,
            background: `
              radial-gradient(circle at center, hsl(0 0% 100%) 0 30%, transparent 31%),
              conic-gradient(
                from 0deg,
                hsl(0 90% 55%),
                hsl(60 90% 55%),
                hsl(120 90% 55%),
                hsl(180 90% 55%),
                hsl(240 90% 55%),
                hsl(300 90% 55%),
                hsl(360 90% 55%)
              )
            `,
            boxShadow:
              "inset 0 0 0 1px color-mix(in oklch, white 35%, transparent)",
          }}
          onPointerDown={bindDrag((x, y) => updateHueFromPointer(x, y))}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
              event.preventDefault()
              setColor({ ...color, h: (color.h + 350) % 360 })
            }
            if (event.key === "ArrowRight" || event.key === "ArrowUp") {
              event.preventDefault()
              setColor({ ...color, h: (color.h + 10) % 360 })
            }
          }}
        >
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 size-3 rounded-full border-2 border-white shadow-sm"
            style={
              {
                transform: `translate(-50%, -50%) rotate(${color.h}deg) translateY(-2.85rem)`,
                background: opaque,
              } as CSSProperties
            }
          />
        </div>

        {/* Alpha capsule — middle rounded bar */}
        <div
          ref={alphaRef}
          role="slider"
          tabIndex={open ? 0 : -1}
          aria-label="Opacity"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(color.a * 100)}
          aria-hidden={!open}
          className={cn(
            "absolute bottom-17 left-1/2 h-11 w-36 -translate-x-1/2 touch-none overflow-hidden rounded-full outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            !open && "pointer-events-none"
          )}
          style={{
            opacity: open ? 1 : 0,
            transform: open
              ? "translate(-50%, 0) scale(1)"
              : "translate(-50%, 3.5rem) scale(0.35)",
            transition: blobTransition,
            backgroundImage: `
              linear-gradient(to right, transparent, ${opaque}),
              linear-gradient(45deg, #c4c4c4 25%, transparent 25%),
              linear-gradient(-45deg, #c4c4c4 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #c4c4c4 75%),
              linear-gradient(-45deg, transparent 75%, #c4c4c4 75%)
            `,
            backgroundSize:
              "100% 100%, 10px 10px, 10px 10px, 10px 10px, 10px 10px",
            backgroundPosition: "0 0, 0 0, 0 5px, 5px -5px, -5px 0",
            backgroundColor: "#fff",
            boxShadow:
              "inset 0 0 0 1px color-mix(in oklch, black 12%, transparent)",
          }}
          onPointerDown={bindDrag((x) => updateAlphaFromPointer(x))}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowUp") {
              event.preventDefault()
              setColor({ ...color, a: clamp(color.a + 0.05, 0, 1) })
            }
            if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
              event.preventDefault()
              setColor({ ...color, a: clamp(color.a - 0.05, 0, 1) })
            }
          }}
        >
          <span
            className="pointer-events-none absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full border-2 border-white shadow-md ring-1 ring-black/10"
            style={{
              left: `calc(${color.a * 100}% - 0.45rem)`,
              background: css,
            }}
          />
        </div>

        {/* Bottom pair: swatch trigger + close */}
        <button
          type="button"
          aria-label={label}
          aria-expanded={open}
          aria-haspopup="dialog"
          className={cn(
            "absolute bottom-0 flex size-12 items-center justify-center rounded-full text-white outline-none",
            "transition-[left,transform] duration-420 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "active:scale-[0.96]",
            open ? "left-[calc(50%-2.75rem)]" : "left-1/2 -translate-x-1/2"
          )}
          style={{
            background: css,
            boxShadow:
              "inset 0 0 0 2px color-mix(in oklch, white 40%, transparent)",
          }}
          onClick={() => setOpen(true)}
        >
          {open ? (
            <RiDropFill className="size-5 opacity-90" />
          ) : (
            <span className="sr-only">{label}</span>
          )}
        </button>

        <button
          type="button"
          aria-label="Close color picker"
          tabIndex={open ? 0 : -1}
          aria-hidden={!open}
          className={cn(
            "absolute bottom-0 left-[calc(50%+0.25rem)] flex size-12 items-center justify-center rounded-full",
            "bg-foreground text-background outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "active:scale-[0.96]",
            !open && "pointer-events-none"
          )}
          style={{
            opacity: open ? 1 : 0,
            transform: open
              ? "translate(0, 0) scale(1)"
              : "translate(-1.5rem, 0) scale(0.4)",
            transition: blobTransition,
          }}
          onClick={() => setOpen(false)}
        >
          <RiCloseLine className="size-5" />
        </button>
      </div>
    </div>
  )
}

export default GooeyColorPicker
