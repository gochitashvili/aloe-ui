import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface ComponentPreviewProps {
  children: ReactNode
  className?: string
  /** Optional label shown above the stage */
  title?: string
  /** Fallback label when title is omitted */
  name?: string
  /** Vertical alignment of the demo */
  align?: "center" | "start" | "end"
}

export function ComponentPreview({
  children,
  className,
  title,
  name,
  align = "center",
}: ComponentPreviewProps) {
  const label = title ?? name

  return (
    <figure
      data-slot="component-preview"
      className={cn(
        "not-prose my-6 w-full overflow-hidden rounded-2xl bg-muted/50",
        className
      )}
    >
      {label ? (
        <figcaption className="px-3.5 py-0.5">
          <span className="text-sm font-medium text-foreground/90">{label}</span>
        </figcaption>
      ) : null}

      <div className={cn("p-1", label && "pt-0")}>
        <div
          className={cn(
            "relative flex min-h-[25svh] w-full flex-wrap gap-4 rounded-[calc(var(--radius-2xl)-2px)] bg-background p-8 ring-1 ring-border/80",
            align === "center" && "items-center justify-center",
            align === "start" && "items-start justify-start",
            align === "end" && "items-end justify-end"
          )}
        >
          <div className="relative z-10 flex max-w-full flex-wrap items-center justify-center gap-3">
            {children}
          </div>
        </div>
      </div>
    </figure>
  )
}

export default ComponentPreview
