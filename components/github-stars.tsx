import { RiGithubFill, RiStarLine } from "@remixicon/react"

import { formatStarCount, getGithubRepoUrl } from "@/lib/github"
import { cn } from "@/lib/utils"

export type GithubStarsProps = {
  stars?: number | null
  className?: string
}

export function GithubStars({ stars = null, className }: GithubStarsProps) {
  const label =
    stars == null
      ? "Star on GitHub"
      : `${formatStarCount(stars)} stars on GitHub`

  return (
    <a
      href={getGithubRepoUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-xl px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground",
        className
      )}
    >
      <RiGithubFill className="size-4" />
      {stars != null ? (
        <span className="inline-flex items-center gap-1 font-medium tabular-nums text-foreground/90">
          <RiStarLine className="size-3.5" />
          {formatStarCount(stars)}
        </span>
      ) : (
        <span className="hidden sm:inline">GitHub</span>
      )}
    </a>
  )
}
