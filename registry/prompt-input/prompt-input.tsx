"use client"

import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export type PromptInputProps = ComponentProps<"input">

/** Minimal prompt field — rebuild from this baseline. */
export function PromptInput({
  className,
  placeholder = "Ask anything…",
  ...props
}: PromptInputProps) {
  return (
    <input
      data-slot="prompt-input"
      placeholder={placeholder}
      className={cn(
        "h-11 w-full min-w-0 rounded-md border border-border bg-background px-3 text-sm outline-none transition-[color,box-shadow,border-color]",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export default PromptInput
