"use client"

import type { CSSProperties, ReactNode } from "react"
import Link from "next/link"

import { DocsSidebar } from "@/components/docs-sidebar"
import { DocsSidebarTrigger } from "@/components/docs-sidebar-trigger"
import { GithubStars } from "@/components/github-stars"
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
  githubStars = null,
}: {
  tree: RootNode
  children: ReactNode
  githubStars?: number | null
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
        className="z-50!"
      >
        <SidebarHeader className="flex h-14 shrink-0 flex-row items-center gap-2 px-4">
          <Link href="/docs" className="min-w-0 text-sm font-medium">
            <span className="truncate">Aloe UI</span>
          </Link>
          <DocsSidebarTrigger className="ml-auto shrink-0" />
        </SidebarHeader>
        <SidebarContent>
          <DocsSidebar tree={tree} embedded />
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-30 bg-background/80 px-6 pt-2 backdrop-blur-md supports-backdrop-filter:bg-background/70">
          <div className="flex h-14 items-center gap-3">
            <DocsSidebarTrigger hideWhenExpanded className="shrink-0" />
            <div className="ml-auto flex items-center gap-1">
              <GithubStars stars={githubStars} />
              <SearchTrigger />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
