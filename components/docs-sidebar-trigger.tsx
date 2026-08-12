"use client"

import { PanelLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function DocsSidebarTrigger({
  className,
  /** Keep layout space, but hide while the sidebar is open. */
  hideWhenExpanded = false,
}: {
  className?: string
  hideWhenExpanded?: boolean
}) {
  const { open, openMobile, isMobile, toggleSidebar } = useSidebar()
  const expanded = isMobile ? openMobile : open
  const concealed = hideWhenExpanded && expanded

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn(
        concealed && "invisible pointer-events-none",
        className
      )}
      aria-label="Toggle navigation menu"
      aria-expanded={expanded}
      aria-controls="docs-sidebar"
      aria-hidden={concealed || undefined}
      tabIndex={concealed ? -1 : undefined}
      onClick={toggleSidebar}
    >
      <PanelLeftIcon />
    </Button>
  )
}
