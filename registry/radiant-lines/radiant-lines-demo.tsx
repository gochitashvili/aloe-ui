"use client"

import { useRef } from "react"

import { RadiantLines } from "@/registry/radiant-lines/radiant-lines"

const PAGES = [
  {
    eyebrow: "Scroll to warp",
    title: "Hyperspace starfield",
    body: "Colored streaks shoot from the center. Scroll to the next page — warp eases with you.",
  },
  {
    eyebrow: "Page two",
    title: "Keep drifting",
    body: "Each snap is a new beat. The field stays pinned while you move between pages.",
  },
  {
    eyebrow: "Page three",
    title: "End of the jump",
    body: "Release and the stars settle back to a slow drift.",
  },
] as const

export function RadiantLinesDemo() {
  const scrollerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={scrollerRef}
      className="no-scrollbar relative h-[56svh] w-full snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-[inherit] bg-background"
    >
      <div className="pointer-events-none sticky top-0 h-[56svh]">
        <RadiantLines containerRef={scrollerRef} />
      </div>

      <div className="relative z-10 -mt-[56svh]">
        {PAGES.map((page) => (
          <section
            key={page.title}
            className="flex h-[56svh] snap-start snap-always flex-col items-center justify-center px-8 text-center"
          >
            <div className="mx-auto flex max-w-md flex-col gap-3">
              <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                {page.eyebrow}
              </p>
              <h3 className="text-2xl font-medium tracking-tight text-foreground">
                {page.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {page.body}
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
