import { readFile } from "node:fs/promises"
import path from "node:path"

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"
import { Step, Steps } from "fumadocs-ui/components/steps"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"

import { CliCommand } from "@/components/cli-command"

export type ComponentInstallProps = {
  /** Registry item name, e.g. `prompt-input` */
  name: string
  /** Path under `registry/`, e.g. `prompt-input/prompt-input.tsx` */
  source: string
  /** Install target path shown in the manual steps */
  target: string
  /** shadcn registry dependencies to install first */
  registryDependencies?: string[]
  /** npm package dependencies */
  dependencies?: string[]
  /** Optional GitHub registry path, e.g. `gochitashvili/aloe-ui/prompt-input` */
  github?: string
}

function packageAdd(packages: string[]) {
  const list = packages.join(" ")
  return {
    npm: `npm install ${list}`,
    pnpm: `pnpm add ${list}`,
    yarn: `yarn add ${list}`,
    bun: `bun add ${list}`,
  }
}

export async function ComponentInstall({
  name,
  source,
  target,
  registryDependencies = [],
  dependencies = [],
  github,
}: ComponentInstallProps) {
  const code = await readFile(
    path.join(process.cwd(), "registry", source),
    "utf8"
  )
  const fileName = path.basename(target)
  const importPath = `@/${target.replace(/\.tsx?$/, "")}`
  const hasDeps = registryDependencies.length > 0 || dependencies.length > 0

  return (
    <Tabs items={["Command", "Manual"]} groupId="install-method" persist>
      <Tab value="Command" className="bg-background">
        <div className="flex flex-col gap-4">
          <CliCommand
            command={`shadcn@latest add @aloe-ui/${name}`}
            className="my-0"
          />
          {github ? (
            <>
              <p className="my-0 text-sm text-fd-muted-foreground">
                Or install from the public GitHub registry:
              </p>
              <CliCommand
                npm={`npx shadcn@latest add ${github}`}
                pnpm={`pnpm dlx shadcn@latest add ${github}`}
                yarn={`yarn dlx shadcn@latest add ${github}`}
                bun={`bunx --bun shadcn@latest add ${github}`}
                className="my-0"
              />
            </>
          ) : null}
        </div>
      </Tab>

      <Tab value="Manual" className="bg-background">
        <Steps>
          {hasDeps ? (
            <Step>
              <h3 className="mt-0!">Install dependencies</h3>
              <p className="text-fd-muted-foreground">
                Copy and paste the following commands into your terminal.
              </p>
              <div className="not-prose flex flex-col gap-3">
                {registryDependencies.length > 0 ? (
                  <CliCommand
                    command={`shadcn@latest add ${registryDependencies.join(" ")}`}
                    className="my-0"
                  />
                ) : null}
                {dependencies.length > 0 ? (
                  <CliCommand {...packageAdd(dependencies)} className="my-0" />
                ) : null}
              </div>
            </Step>
          ) : null}

          <Step>
            <h3 className={hasDeps ? undefined : "mt-0!"}>
              Copy the component
            </h3>
            <p className="text-fd-muted-foreground">
              Create <code className="text-fd-foreground">{target}</code> and
              paste the following code.
            </p>
            <DynamicCodeBlock
              lang="tsx"
              code={code}
              codeblock={{
                title: fileName,
                viewportProps: {
                  className: "max-h-[min(28rem,70vh)]",
                },
              }}
            />
          </Step>

          <Step>
            <h3>Update the import paths</h3>
            <p className="mb-0 text-fd-muted-foreground">
              Import the component from{" "}
              <code className="text-fd-foreground">{importPath}</code>.
            </p>
          </Step>
        </Steps>
      </Tab>
    </Tabs>
  )
}
