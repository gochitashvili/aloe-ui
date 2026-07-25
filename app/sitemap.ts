import type { MetadataRoute } from "next"

import { source } from "@/lib/source"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const params = source.generateParams()

  return [
    {
      url: "https://23rd.dev",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://23rd.dev/docs",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...(await params).map((param) => {
      const slug = param.slug?.join("/") ?? ""
      return {
        url: `https://23rd.dev/docs/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }
    }),
  ]
}
