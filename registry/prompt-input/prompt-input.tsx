"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { PlusIcon, SendHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

const promptInputVariants = cva("h-auto w-full items-end", {
  variants: {
    variant: {
      default: "",
      outline: "border-border bg-background dark:bg-background",
      ghost: "border-transparent shadow-none dark:bg-transparent",
    },
    size: {
      default: "has-[textarea]:min-h-16",
      sm: "has-[textarea]:min-h-12",
      lg: "has-[textarea]:min-h-20",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

type PromptInputProps = Omit<
  React.ComponentProps<typeof InputGroup>,
  "children"
> &
  VariantProps<typeof promptInputVariants> & {
    placeholder?: string
    disabled?: boolean
    textareaProps?: React.ComponentProps<typeof InputGroupTextarea>
  }

/**
 * Skeleton composer built from shadcn primitives:
 * InputGroup + InputGroupTextarea + Button + DropdownMenu.
 */
function PromptInput({
  className,
  variant = "default",
  size = "default",
  placeholder = "Ask anything…",
  disabled = false,
  textareaProps,
  ...props
}: PromptInputProps) {
  return (
    <InputGroup
      data-slot="prompt-input"
      className={cn(promptInputVariants({ variant, size }), className)}
      {...props}
    >
      <InputGroupTextarea
        data-slot="prompt-input-textarea"
        placeholder={placeholder}
        disabled={disabled}
        {...textareaProps}
        className={cn(
          size === "sm" && "min-h-12 py-2 text-sm",
          size === "default" && "min-h-16 py-3",
          size === "lg" && "min-h-20 py-3.5",
          textareaProps?.className
        )}
      />

      <InputGroupAddon align="inline-start" className="pb-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size={size === "sm" ? "icon-xs" : "icon-sm"}
                disabled={disabled}
                aria-label="Add"
              />
            }
          >
            <PlusIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem>Upload files</DropdownMenuItem>
              <DropdownMenuItem>Add context</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>

      <InputGroupAddon align="inline-end" className="pb-2">
        <Button
          type="button"
          size={size === "sm" ? "icon-xs" : "icon-sm"}
          disabled={disabled}
          aria-label="Send"
        >
          <SendHorizontalIcon />
        </Button>
      </InputGroupAddon>
    </InputGroup>
  )
}

export { PromptInput, promptInputVariants }
export type { PromptInputProps }
