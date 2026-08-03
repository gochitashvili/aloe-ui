"use client"

import { useState } from "react"
import { RiArrowDownLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { StretchyFooter } from "@/registry/stretchy-footer/stretchy-footer"

/** Fixed page-level rubber overscroll for the Stretchy Footer docs page. */
export function StretchyFooterPageEffect() {
  return <StretchyFooter windowScroll maxStretch={300} />
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function documentScrollTop() {
  return window.scrollY || document.documentElement.scrollTop
}

function documentMaxScroll() {
  const el = document.documentElement
  return Math.max(0, el.scrollHeight - el.clientHeight)
}

function atBottom(tolerance = 2) {
  return documentScrollTop() >= documentMaxScroll() - tolerance
}

/** Smooth-scroll to the page end, then pulse wheel events to show the stretch. */
async function playStretchDemo() {
  const target = documentMaxScroll()
  window.scrollTo({ top: target, behavior: "smooth" })

  const started = performance.now()
  while (!atBottom() && performance.now() - started < 2500) {
    await sleep(32)
  }
  window.scrollTo({ top: documentMaxScroll() })
  await sleep(40)

  // Keep events under the footer's wheel-idle timeout so the band stays up,
  // then let idle snap it back — that is the full effect.
  for (let i = 0; i < 14; i++) {
    window.dispatchEvent(
      new WheelEvent("wheel", {
        deltaY: 48,
        deltaMode: 0,
        bubbles: true,
        cancelable: true,
      })
    )
    await sleep(28)
  }
}

/** Preview card — scrolls the docs page and demos the rubber overscroll. */
export function StretchyFooterDemo() {
  const [playing, setPlaying] = useState(false)

  async function onShowEffect() {
    if (playing) return
    setPlaying(true)
    try {
      await playStretchDemo()
    } finally {
      setPlaying(false)
    }
  }

  return (
    <div className="flex min-h-[28svh] w-full flex-col items-center justify-center gap-4 bg-background px-6 py-12 text-center">
      <p className="text-sm text-muted-foreground">
        Scroll past the end of this page — or play the effect from here.
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
    </div>
  )
}
