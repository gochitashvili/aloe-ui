"use client"

import { useState, type ReactNode } from "react"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ComponentPreviewProps {
  children: ReactNode
  className?: string
  /** Classes applied to the inner demo stage */
  stageClassName?: string
  /** Optional label shown above the stage */
  title?: string
  /** Fallback label when title is omitted */
  name?: string
  /** Vertical alignment of the demo */
  align?: "center" | "start" | "end"
  /** Example source shown under the preview */
  code?: string
  /** Shiki language for the code panel */
  lang?: string
  /** Open the code panel by default */
  defaultOpen?: boolean
}

export function ComponentPreview({
  children,
  className,
  stageClassName,
  title,
  name,
  align = "center",
  code,
  lang = "tsx",
  defaultOpen = false,
}: ComponentPreviewProps) {
  const label = title ?? name
  const [open, setOpen] = useState(defaultOpen)
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // ignore
    }
  }

  return (
    <figure
      data-slot="component-preview"
      className={cn(
        "not-prose my-6 w-full overflow-hidden rounded-2xl bg-muted/50",
        className
      )}
    >
      {label ? (
        <figcaption className="px-3.5 py-0.5">
          <span className="text-sm font-medium text-foreground/90">{label}</span>
        </figcaption>
      ) : null}

      <div className={cn("p-1", label && "pt-0")}>
        <div
          className={cn(
            "overflow-hidden rounded-[calc(var(--radius-2xl)-2px)] bg-background ring-1 ring-border/80"
          )}
        >
          <div
            className={cn(
              "relative flex min-h-[36svh] w-full flex-wrap gap-4 p-8",
              align === "center" && "items-center justify-center",
              align === "start" && "items-start justify-start",
              align === "end" && "items-end justify-end",
              stageClassName
            )}
          >
            <div className="relative z-10 flex w-full max-w-full flex-wrap items-center justify-center gap-3">
              {children}
            </div>
          </div>

          {code ? (
            <div
              data-slot="component-preview-code"
              data-open={open ? "true" : "false"}
              className="relative border-t border-border/80"
            >
              <div
                className={cn(
                  "overflow-hidden transition-[max-height] duration-300 ease-out",
                  open ? "max-h-[min(24rem,70vh)]" : "max-h-44"
                )}
              >
                <DynamicCodeBlock
                  lang={lang}
                  code={code}
                  codeblock={{
                    allowCopy: false,
                    className:
                      "my-0 rounded-none border-none bg-transparent shadow-none [&>div]:rounded-none",
                    viewportProps: {
                      className: cn(
                        open && "max-h-[min(24rem,70vh)] overflow-auto"
                      ),
                    },
                  }}
                />
              </div>

              {!open ? (
                <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-background via-background/85 to-transparent">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setOpen(true)}
                    className="shadow-xs"
                  >
                    View Code
                  </Button>
                </div>
              ) : (
                <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={copied ? "Copied" : "Copy code"}
                    onClick={onCopy}
                    className="bg-background/80 text-muted-foreground backdrop-blur-sm hover:text-foreground"
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpen(false)}
                    className="bg-background/80 text-muted-foreground backdrop-blur-sm hover:text-foreground"
                  >
                    Hide
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </figure>
  )
}

export default ComponentPreview
