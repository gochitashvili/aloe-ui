import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 text-center">
      <div className="max-w-sm space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">404</h1>
        <p className="text-muted-foreground">
          This page could not be found. It might have been moved or deleted.
        </p>
        <Link href="/" className={cn(buttonVariants({ variant: "default" }))}>
          Back home
        </Link>
      </div>
    </div>
  )
}
