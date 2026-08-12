import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import { Step, Steps } from "fumadocs-ui/components/steps"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"

import { CliCommand } from "@/components/cli-command"
import { ComponentInstall } from "@/components/component-install"
import { ComponentPreview } from "@/components/component-preview"
import { MdxPre } from "@/components/mdx-pre"
import {
  MdxTable,
  MdxTableBody,
  MdxTableCell,
  MdxTableHead,
  MdxTableHeader,
  MdxTableRow,
} from "@/components/mdx-table"

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    CliCommand,
    ComponentInstall,
    ComponentPreview,
    Steps,
    Step,
    Tabs,
    Tab,
    pre: MdxPre,
    table: MdxTable,
    thead: MdxTableHeader,
    tbody: MdxTableBody,
    tr: MdxTableRow,
    th: MdxTableHead,
    td: MdxTableCell,
    ...components,
  } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
