"use client"

import type { ComponentProps } from "react"
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"

import { cn } from "@/lib/utils"

export function MdxPre({
  className,
  children,
  ...props
}: ComponentProps<typeof CodeBlock>) {
  return (
    <CodeBlock
      {...props}
      className={cn("bg-transparent! shadow-none!", className)}
    >
      <Pre>{children}</Pre>
    </CodeBlock>
  )
}
