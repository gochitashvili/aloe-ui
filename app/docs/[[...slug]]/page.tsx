import { createRelativeLink } from "fumadocs-ui/mdx"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DocsToc } from "@/components/docs-toc"
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
      <DocsToc items={page.data.toc} />
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
