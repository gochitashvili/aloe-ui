import { createRelativeLink } from "fumadocs-ui/mdx"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getMDXComponents } from "@/components/mdx"
import { source } from "@/lib/source"

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <div className="mx-auto w-full max-w-275 px-6 py-10 md:py-14">
      <div className="flex gap-10">
        <article className="min-w-0 flex-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            {page.data.title}
          </h1>
          {page.data.description ? (
            <p className="mt-3 text-lg text-muted-foreground">
              {page.data.description}
            </p>
          ) : null}
          <div className="prose mt-8 flex-1">
            <MDX
              components={getMDXComponents({
                a: createRelativeLink(source, page),
              })}
            />
          </div>
        </article>
        {page.data.toc.length > 0 ? (
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-24">
              <p className="text-sm font-medium text-muted-foreground">
                On this page
              </p>
              <ul className="mt-3 space-y-2">
                {page.data.toc.map((item) => (
                  <li key={item.url}>
                    <a
                      href={item.url}
                      aria-label={String(item.title)}
                      className="block text-sm text-muted-foreground transition-colors hover:text-foreground data-[depth=3]:ps-3 data-[depth=4]:ps-6"
                      data-depth={item.depth}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}
