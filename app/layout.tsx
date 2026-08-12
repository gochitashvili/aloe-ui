import { Geist, Geist_Mono, IBM_Plex_Sans, Source_Sans_3 } from "next/font/google"
import { RootProvider } from "fumadocs-ui/provider/next"
import type { Metadata } from "next"
import type { ReactNode } from "react"

import { DocsSearchDialog } from "@/components/docs-search-dialog"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { source } from "@/lib/source"
import { flattenPageTree } from "@/lib/tree"

import "./globals.css"

const sourceSans3Heading = Source_Sans_3({subsets:['latin'],variable:'--font-heading'});

export const metadata: Metadata = {
  title: {
    default: "Aloe UI Docs",
    template: "%s · Aloe UI",
  },
  description:
    "Opinionated components for shippers — documentation and registry built with Fumadocs MDX and Next.js.",
  metadataBase: new URL("https://www.aloeui.com"),
}

const ibmPlexSans = IBM_Plex_Sans({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const links = flattenPageTree(source.getPageTree()).map(
    (item) => [item.title, item.url] as [string, string]
  )

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
              "font-sans antialiased",
              fontMono.variable
            , "font-sans", ibmPlexSans.variable, sourceSans3Heading.variable)}
    >
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <RootProvider
            search={{
              links,
              SearchDialog: DocsSearchDialog,
            }}
          >
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </RootProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
