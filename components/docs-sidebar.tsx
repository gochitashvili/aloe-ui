"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type PageNode = { type: "page"; name: React.ReactNode; url: string }
type SeparatorNode = { type: "separator"; name?: React.ReactNode }
type FolderNode = {
  type: "folder"
  name: React.ReactNode
  children: TreeNode[]
  index?: PageNode
  defaultOpen?: boolean
}
type RootNode = { type?: "root"; name: React.ReactNode; children: TreeNode[] }
type TreeNode = PageNode | SeparatorNode | FolderNode

function isPage(node: TreeNode): node is PageNode {
  return node.type === "page"
}

function isFolder(node: TreeNode): node is FolderNode {
  return node.type === "folder"
}

function isCurrent(pathname: string, url: string) {
  return pathname === url
}

function NavList({ nodes, pathname }: { nodes: TreeNode[]; pathname: string }) {
  return (
    <SidebarMenu>
      {nodes.map((node, i) => {
        if (isPage(node)) {
          return (
            <SidebarMenuItem key={node.url ?? i}>
              <SidebarMenuButton
                render={
                  <Link
                    href={node.url}
                    aria-label={String(node.name ?? "Page")}
                  />
                }
                isActive={isCurrent(pathname, node.url)}
                className="hover:bg-foreground/5 data-active:bg-foreground/10"
              >
                <span className="truncate">{node.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        }

        if (isFolder(node)) {
          const pages = node.children.filter(isPage)
          const folders = node.children.filter(isFolder)
          return (
            <React.Fragment key={i}>
              {node.index ? (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={
                      <Link
                        href={node.index.url}
                        aria-label={String(node.name ?? "Page")}
                      />
                    }
                    isActive={isCurrent(pathname, node.index.url)}
                    className="hover:bg-foreground/5 data-active:bg-foreground/10"
                  >
                    <span className="truncate">{node.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : null}
              {pages.length > 0 ? (
                <SidebarGroup>
                  {node.index ? null : (
                    <SidebarGroupLabel>{node.name}</SidebarGroupLabel>
                  )}
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {pages.map((child) => (
                        <SidebarMenuItem key={child.url}>
                          <SidebarMenuButton
                            render={
                              <Link
                                href={child.url}
                                aria-label={String(child.name ?? "Page")}
                              />
                            }
                            isActive={isCurrent(pathname, child.url)}
                            className="pl-6 hover:bg-foreground/5 data-active:bg-foreground/10"
                          >
                            <span className="truncate">{child.name}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ) : null}
              {folders.length > 0 ? (
                <NavList nodes={folders} pathname={pathname} />
              ) : null}
            </React.Fragment>
          )
        }

        return null
      })}
    </SidebarMenu>
  )
}

export function DocsSidebar({
  tree,
  className,
  id,
}: {
  tree: RootNode
  className?: string
  id?: string
}) {
  const pathname = usePathname()

  return (
    <Sidebar
      id={id}
      variant="floating"
      collapsible="offcanvas"
      className={cn(className)}
    >
      <SidebarHeader className="px-4 pt-5 pb-1">
        <Link
          href="/docs"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          23rd Docs
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <NavList nodes={tree.children} pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
