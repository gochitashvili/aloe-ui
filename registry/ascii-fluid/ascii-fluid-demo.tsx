"use client"

import { AsciiFluid } from "@/registry/ascii-fluid/ascii-fluid"

export function AsciiFluidDemo() {
  return (
    <div className="relative h-[56svh] w-full overflow-hidden rounded-[inherit] bg-background">
      <AsciiFluid className="absolute inset-0" />
    </div>
  )
}
