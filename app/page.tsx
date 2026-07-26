import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <Logo className="mb-4 size-12 rounded-md" />
          <h1 className="font-medium">Docs ready</h1>
          <p>
            Fumadocs MDX is wired up. Open the docs shell to edit sidebar and
            page layout later.
          </p>
          <Link
            href="/docs"
            className={cn(buttonVariants({ variant: "default" }), "mt-2")}
          >
            Open docs
          </Link>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
