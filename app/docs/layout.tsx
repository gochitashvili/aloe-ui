import type { ReactNode } from "react"

import { DocsShell } from "@/components/docs-shell"
import { getGithubStars } from "@/lib/github"
import { source } from "@/lib/source"

export default async function Layout({ children }: { children: ReactNode }) {
  const githubStars = await getGithubStars()

  return (
    <DocsShell
      tree={source.getPageTree() as never}
      githubStars={githubStars}
    >
      {children}
    </DocsShell>
  )
}
