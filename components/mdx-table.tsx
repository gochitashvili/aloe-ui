import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react"

import { cn } from "@/lib/utils"

export function MdxTable({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div
      data-slot="mdx-table"
      className="not-prose my-6 w-full overflow-hidden rounded-2xl bg-muted/50"
    >
      <div className="bg-muted/50 p-1">
        <div className="overflow-x-auto rounded-[calc(var(--radius-2xl)-2px)] ring-[1px] ring-border/80 bg-background shadow-none">
          <table
            className={cn("w-full caption-bottom text-sm", className)}
            {...props}
          />
        </div>
      </div>
    </div>
  )
}

export function MdxTableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("border-b border-border/80 bg-muted/40", className)}
      {...props}
    />
  )
}

export function MdxTableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

export function MdxTableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b border-border/70 transition-colors hover:bg-muted/30",
        className
      )}
      {...props}
    />
  )
}

export function MdxTableHead({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-9 px-3.5 text-left align-middle text-xs font-medium tracking-wide text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export function MdxTableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "px-3.5 py-2.5 align-middle text-foreground/90",
        className
      )}
      {...props}
    />
  )
}
