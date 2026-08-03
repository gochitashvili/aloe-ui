"use client"

import { useRef, useState } from "react"
import { RiArrowDownLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import {
  playStretchyFooterDemo,
  StretchyFooter,
} from "@/registry/stretchy-footer/stretchy-footer"

const PREVIEW_DEMO_ID = "stretchy-footer-preview"

/** Fixed page-level rubber overscroll for the Stretchy Footer docs page. */
export function StretchyFooterPageEffect() {
  return (
    <StretchyFooter
      windowScroll
      maxStretch={300}
      demoId="stretchy-footer-page"
    />
  )
}

/** Preview card with its own scroller — button plays the stretch in-place. */
export function StretchyFooterDemo() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)

  async function onShowEffect() {
    if (playing) return
    setPlaying(true)
    try {
      await playStretchyFooterDemo({
        target: PREVIEW_DEMO_ID,
        amount: 0.9,
        holdMs: 900,
        scrollRoot: scrollerRef.current,
      })
    } finally {
      setPlaying(false)
    }
  }

  return (
    <div className="relative h-[56svh] w-full overflow-hidden rounded-[inherit] bg-background">
      <StretchyFooter
        demoId={PREVIEW_DEMO_ID}
        scrollRef={scrollerRef}
        contentSelector="[data-stretchy-preview]"
        maxStretch={220}
        className="z-20"
      />

      <div
        ref={scrollerRef}
        className="no-scrollbar relative z-10 h-full overflow-y-auto overscroll-contain"
      >
        <div
          data-stretchy-preview
          className="flex min-h-[145%] flex-col items-center justify-center gap-4 px-6 py-16 text-center"
        >
          <p className="max-w-sm text-sm text-muted-foreground">
            Scroll past the end of this card — or play the rubber-band from
            here.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={onShowEffect}
            disabled={playing}
          >
            <RiArrowDownLine data-icon="inline-start" />
            {playing ? "Playing…" : "Show effect"}
          </Button>
          <p className="text-xs text-muted-foreground/80">
            Tip: keep scrolling after you hit the bottom.
          </p>
        </div>
      </div>
    </div>
  )
}
