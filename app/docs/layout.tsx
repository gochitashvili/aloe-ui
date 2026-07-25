import type { CSSProperties, ReactNode } from "react"
import Link from "next/link"

import { source } from "@/lib/source"
import { DocsSidebar } from "@/components/docs-sidebar"
import { DocsSidebarTrigger } from "@/components/docs-sidebar-trigger"
import { SearchTrigger } from "@/components/search-trigger"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

const sidebarTokens: CSSProperties = {
  "--sidebar": "var(--background)",
  "--sidebar-foreground": "var(--foreground)",
  "--sidebar-border": "var(--border)",
  "--sidebar-accent": "color-mix(in oklch, var(--foreground) 6%, transparent)",
  "--sidebar-accent-foreground": "var(--foreground)",
  "--sidebar-ring": "var(--ring)",
} as CSSProperties

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      style={sidebarTokens}
      className="[&_[data-slot=sidebar-gap]]:w-0!"
    >
      <DocsSidebar id="docs-sidebar" tree={source.getPageTree() as never} />
      <SidebarInset className="min-w-0">
        <header className="flex h-14 w-full items-center gap-3 px-6 transition-[padding] duration-200 ease-linear md:group-has-[[data-slot=sidebar][data-state=expanded]]/sidebar-wrapper:ps-[calc(var(--sidebar-width)+1.5rem)]">
          <DocsSidebarTrigger />
          <Link href="/docs" className="text-sm font-medium">
            23rd Docs
          </Link>
          <div className="ml-auto">
            <SearchTrigger />
          </div>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
