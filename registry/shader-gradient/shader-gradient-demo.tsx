"use client"

import { ShaderGradient } from "@/registry/shader-gradient/shader-gradient"

export function ShaderGradientDemo() {
  return (
    // Stage uses shadcn background; gradient follows html.dark via theme="auto"
    <div className="relative h-[56svh] w-full overflow-hidden rounded-[inherit] bg-background">
      <ShaderGradient className="absolute inset-0" />
    </div>
  )
}
