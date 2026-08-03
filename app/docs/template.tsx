import type { ReactNode } from "react"
import { ViewTransition } from "react"

/**
 * Remounts on docs navigations so enter/exit view transitions can run
 * while the layout chrome (sidebar, header) stays put.
 */
export default function DocsTemplate({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-blur" exit="page-blur" default="none">
      {children}
    </ViewTransition>
  )
}
