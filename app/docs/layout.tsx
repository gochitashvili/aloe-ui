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
    <SidebarProvider style={sidebarTokens}>
      <nav aria-label="Documentation">
        <DocsSidebar id="docs-sidebar" tree={source.getPageTree() as never} />
      </nav>
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 px-4">
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
