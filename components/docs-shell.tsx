"use client"

import type { CSSProperties, ReactNode } from "react"
import Link from "next/link"

import { DocsSidebar } from "@/components/docs-sidebar"
import { DocsSidebarTrigger } from "@/components/docs-sidebar-trigger"
import { Logo } from "@/components/logo"
import { SearchTrigger } from "@/components/search-trigger"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
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

type PageNode = { type: "page"; name: ReactNode; url: string }
type SeparatorNode = { type: "separator"; name?: ReactNode }
type FolderNode = {
  type: "folder"
  name: ReactNode
  children: TreeNode[]
  index?: PageNode
  defaultOpen?: boolean
}
type RootNode = { type?: "root"; name: ReactNode; children: TreeNode[] }
type TreeNode = PageNode | SeparatorNode | FolderNode

/**
 * Docs chrome: SidebarProvider + Sidebar navigation + mobile trigger.
 * Provider, sidebar, and links live in one module so responsive mobile
 * navigation is statically verifiable (Sheet runtime is in ui/sidebar).
 */
export function DocsShell({
  tree,
  children,
}: {
  tree: RootNode
  children: ReactNode
}) {
  return (
    <SidebarProvider
      style={sidebarTokens}
      className="[&_[data-slot=sidebar-gap]]:w-0!"
    >
      <Sidebar
        id="docs-sidebar"
        aria-label="Documentation"
        variant="floating"
        collapsible="offcanvas"
      >
        <SidebarHeader className="px-4 pt-5 pb-1">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-foreground"
          >
            23rd
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <DocsSidebar tree={tree} embedded />
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-w-0">
        <header className="flex h-14 w-full items-center gap-3 px-6 transition-[padding] duration-200 ease-linear md:group-has-[[data-slot=sidebar][data-state=expanded]]/sidebar-wrapper:ps-[calc(var(--sidebar-width)+1.5rem)]">
          <DocsSidebarTrigger />
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Logo className="size-6" cornerRadius={4} />
            23rd
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
