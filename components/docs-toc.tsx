"use client"

import type { TOCItemType } from "fumadocs-core/toc"
import { TOCProvider } from "fumadocs-ui/components/toc"
import { TOCItem, TOCItems } from "fumadocs-ui/components/toc/default"

export function DocsToc({ items }: { items: TOCItemType[] }) {
  if (items.length === 0) return null

  return (
    <aside className="absolute inset-y-0 right-6 hidden w-52 xl:block">
      <div className="sticky top-24 py-10 md:py-14">
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          On this page
        </p>
        <TOCProvider toc={items} single>
          <TOCItems className="ms-0.5">
            {items.map((item) => (
              <TOCItem key={item.url} item={item} />
            ))}
          </TOCItems>
        </TOCProvider>
      </div>
    </aside>
  )
}
