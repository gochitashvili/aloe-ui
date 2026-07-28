import Link from "next/link"

import { Logo } from "@/components/logo"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Page() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.92_0.01_260)_0%,transparent_55%),radial-gradient(ellipse_at_bottom,oklch(0.94_0.008_80)_0%,transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,oklch(0.28_0.02_260)_0%,transparent_55%),radial-gradient(ellipse_at_bottom,oklch(0.22_0.015_80)_0%,transparent_50%)]"
      />
      <div className="relative flex flex-col items-center text-center">
        <Logo
          className="size-20 animate-in fade-in zoom-in-95 duration-700 fill-mode-both sm:size-24"
          cornerRadius={8}
        />
        <h1 className="mt-8 animate-in fade-in slide-in-from-bottom-2 fill-mode-both text-4xl font-semibold tracking-tight duration-700 delay-150 sm:text-5xl">
          23rd
        </h1>
        <p className="mt-3 max-w-md animate-in fade-in slide-in-from-bottom-2 fill-mode-both text-base text-muted-foreground duration-700 delay-300">
          Opinionated components for shippers.
        </p>
        <div className="mt-8 flex animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex-wrap items-center justify-center gap-3 duration-700 delay-500">
          <Link
            href="/docs"
            className={cn(buttonVariants({ variant: "default", size: "lg" }))}
          >
            Open docs
          </Link>
          <Link
            href="/demo"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            View demo
          </Link>
        </div>
      </div>
    </main>
  )
}
