"use client"

import { RiSideBarLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function DocsSidebarTrigger({
  className,
}: {
  className?: string
}) {
  const { open, openMobile, isMobile, toggleSidebar } = useSidebar()
  const expanded = isMobile ? openMobile : open

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      aria-label="Toggle navigation menu"
      aria-expanded={expanded}
      aria-controls="docs-sidebar"
      onClick={toggleSidebar}
    >
      <RiSideBarLine />
    </Button>
  )
}
