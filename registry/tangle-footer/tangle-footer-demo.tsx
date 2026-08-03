"use client"

import { TangleFooter } from "@/registry/tangle-footer/tangle-footer"

export function TangleFooterDemo() {
  return (
    <div className="flex h-[56svh] w-full flex-col justify-end overflow-hidden rounded-[inherit] bg-[#EFEAE2] dark:bg-[#121210]">
      <div className="w-full max-w-7xl self-center">
        <TangleFooter
          background="transparent"
          lines={[
            "Ship something opinionated — less boilerplate, clearer decisions. ",
            "Knows what’s going on. Can you check in with them and see what’s next. ",
            "The new timeline should be ready by Friday, although it’s probably going to slip. ",
            "Open the docs, grab a component, and make it yours in the codebase. ",
            "Radiant lines, shader wash, gooey picker — install what you need and move. ",
          ]}
        />
      </div>
    </div>
  )
}
