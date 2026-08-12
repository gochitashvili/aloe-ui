"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const promptInputVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      outline:
        "[&_[data-slot=input-group]]:border-border [&_[data-slot=input-group]]:bg-background dark:[&_[data-slot=input-group]]:bg-background",
      ghost:
        "[&_[data-slot=input-group]]:border-transparent [&_[data-slot=input-group]]:bg-transparent [&_[data-slot=input-group]]:shadow-none dark:[&_[data-slot=input-group]]:bg-transparent",
    },
    size: {
      sm: "[&_[data-slot=input-group-control]]:min-h-12 [&_[data-slot=input-group-control]]:py-2 [&_[data-slot=input-group-control]]:text-sm",
      default:
        "[&_[data-slot=input-group-control]]:min-h-16 [&_[data-slot=input-group-control]]:py-3",
      lg: "[&_[data-slot=input-group-control]]:min-h-20 [&_[data-slot=input-group-control]]:py-3.5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

function PromptInput({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof promptInputVariants>) {
  return (
    <div
      data-slot="prompt-input"
      data-size={size}
      data-variant={variant}
      className={cn(promptInputVariants({ size, variant }), className)}
      {...props}
    />
  )
}

export { PromptInput, promptInputVariants }
