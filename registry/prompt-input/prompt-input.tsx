"use client"

import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export type PromptInputProps = ComponentProps<"input">

/**
 * Minimal prompt field for AI chat UIs.
 * Placeholder implementation — replace with the final design later.
 */
export function PromptInput({
  className,
  type = "text",
  placeholder = "Ask anything…",
  ...props
}: PromptInputProps) {
  return (
    <input
      type={type}
      data-slot="prompt-input"
      placeholder={placeholder}
      className={cn(
        "h-11 w-full min-w-0 rounded-2xl border border-border bg-background px-4 text-sm outline-none transition-[color,box-shadow,border-color]",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}
