"use client"

import { StretchyFooter } from "@/registry/stretchy-footer/stretchy-footer"

/** Fixed page-level rubber overscroll for the Stretchy Footer docs page. */
export function StretchyFooterPageEffect() {
  return <StretchyFooter windowScroll maxStretch={300} />
}

/** Static hint — the live effect runs on the docs page itself. */
export function StretchyFooterDemo() {
  return (
    <div className="flex min-h-[28svh] w-full items-center justify-center bg-[#0A0A0C] px-6 py-12 text-center">
      <p className="text-sm text-white/55">Scroll to see the effect</p>
    </div>
  )
}
