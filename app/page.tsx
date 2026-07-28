import { Logo } from "@/components/logo"

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center text-center">
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
        <p className="mt-2 animate-in fade-in slide-in-from-bottom-2 fill-mode-both font-mono text-sm text-muted-foreground/80 duration-700 delay-500">
          Coming soon · 23rd.dev
        </p>
      </div>
    </main>
  )
}
