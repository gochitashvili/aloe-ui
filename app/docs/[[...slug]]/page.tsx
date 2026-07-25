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
  const hasToc = page.data.toc.length > 0

  return (
    <div className="relative w-full px-6 py-10 md:py-14">
      <article className="mx-auto w-full max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          {page.data.title}
        </h1>
        {page.data.description ? (
          <p className="mt-3 text-lg text-muted-foreground">
            {page.data.description}
          </p>
        ) : null}
        <div className="prose mt-8">
          <MDX
            components={getMDXComponents({
              a: createRelativeLink(source, page),
            })}
          />
        </div>
      </article>
      {hasToc ? (
        <aside className="absolute inset-y-0 right-6 hidden w-52 xl:block">
          <div className="sticky top-24 py-10 md:py-14">
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
