"use client"

import { useId, type ReactNode } from "react"
import { RiRefreshLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

function toHex6(value: string) {
  const raw = value.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw.toUpperCase()
  if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
    const [, r, g, b] = raw
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
  }
  return "#000000"
}

export type ComponentControlsProps = {
  children: ReactNode
  /** Label in the figcaption — matches CliCommand / ComponentPreview */
  title?: string
  hasChanges?: boolean
  onReset?: () => void
  className?: string
}

/**
 * Docs section for live prop controls — same chrome as CliCommand, tables,
 * and ComponentPreview (`rounded-2xl bg-muted/50` figure + ringed stage).
 */
export function ComponentControls({
  children,
  title = "Props",
  hasChanges = false,
  onReset,
  className,
}: ComponentControlsProps) {
  return (
    <figure
      data-slot="component-controls"
      className={cn(
        "not-prose my-6 w-full overflow-hidden rounded-2xl bg-muted/50",
        className
      )}
    >
      <figcaption className="flex items-center justify-between gap-3 px-3.5 py-0.5">
        <span className="text-sm font-medium text-foreground/90">{title}</span>
        {hasChanges && onReset ? (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onReset}
            aria-label="Reset props"
            className="text-muted-foreground"
          >
            <RiRefreshLine data-icon="inline-start" />
            Reset
          </Button>
        ) : null}
      </figcaption>

      <div className="p-1 pt-0">
        <div className="flex flex-col gap-4 rounded-[calc(var(--radius-2xl)-2px)] bg-background px-3.5 py-3.5 ring-1 ring-border/80 sm:px-4">
          {children}
        </div>
      </div>
    </figure>
  )
}

function formatValue(value: number) {
  if (Number.isInteger(value)) return String(value)
  const abs = Math.abs(value)
  if (abs >= 10) return value.toFixed(1)
  return value.toFixed(2)
}

export type ControlSliderProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  format?: (value: number) => string
  onChange: (value: number) => void
  className?: string
}

export function ControlSlider({
  label,
  value,
  min,
  max,
  step = 1,
  format = formatValue,
  onChange,
  className,
}: ControlSliderProps) {
  const id = useId()

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="text-sm font-medium text-foreground/90"
        >
          {label}
        </label>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {format(value)}
        </span>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(next) => {
          const n = Array.isArray(next) ? next[0] : next
          if (typeof n === "number") onChange(n)
        }}
      />
    </div>
  )
}

export type ControlSwitchProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
  className?: string
}

export function ControlSwitch({
  label,
  checked,
  onChange,
  description,
  className,
}: ControlSwitchProps) {
  const id = useId()

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex min-w-0 flex-col gap-0.5">
        <label htmlFor={id} className="text-sm font-medium text-foreground/90">
          {label}
        </label>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        size="sm"
      />
    </div>
  )
}

export type ControlColorProps = {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ControlColor({
  label,
  value,
  onChange,
  className,
}: ControlColorProps) {
  const id = useId()
  const hex = toHex6(value)

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground/90">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <label className="relative size-8 shrink-0 cursor-pointer overflow-hidden rounded-2xl ring-1 ring-border/80 transition-[box-shadow] hover:ring-ring/40 focus-within:ring-3 focus-within:ring-ring/30">
          <span
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundColor: hex }}
          />
          <input
            id={id}
            type="color"
            value={hex}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </label>
        <span className="font-mono text-xs text-muted-foreground uppercase tabular-nums">
          {hex}
        </span>
      </div>
    </div>
  )
}

export type ControlColorsProps = {
  label: string
  colors: string[]
  /** Optional per-swatch labels (e.g. sky, sage) */
  swatchLabels?: string[]
  onChange: (colors: string[]) => void
  className?: string
}

export function ControlColors({
  label,
  colors,
  swatchLabels,
  onChange,
  className,
}: ControlColorsProps) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <span className="text-sm font-medium text-foreground/90">{label}</span>
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => {
          const hex = toHex6(color)
          const swatchLabel = swatchLabels?.[index] ?? `Color ${index + 1}`
          return (
            <label
              key={`${swatchLabel}-${index}`}
              className="group flex cursor-pointer flex-col items-center gap-1.5"
              title={swatchLabel}
            >
              <span className="relative size-9 overflow-hidden rounded-2xl ring-1 ring-border/80 transition-[box-shadow] group-hover:ring-ring/40 group-focus-within:ring-3 group-focus-within:ring-ring/30">
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{ backgroundColor: hex }}
                />
                <input
                  type="color"
                  value={hex}
                  aria-label={swatchLabel}
                  onChange={(e) => {
                    const next = colors.map((c, i) =>
                      i === index ? e.target.value.toUpperCase() : c
                    )
                    onChange(next)
                  }}
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                />
              </span>
              {swatchLabels?.[index] ? (
                <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                  {swatchLabels[index]}
                </span>
              ) : null}
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default ComponentControls
