import { spawnSync } from "node:child_process"
import { writeFileSync } from "node:fs"

import {
  ROOT,
  ROOT_REGISTRY_PATH,
  composeRootRegistry,
  discoverIncludes,
  readRootRegistry,
  serializeRegistry,
} from "./registry-lib.mjs"

function writeRootRegistry(includes) {
  const next = composeRootRegistry(readRootRegistry(), includes)
  writeFileSync(ROOT_REGISTRY_PATH, serializeRegistry(next))
  return next
}

function run(commandLine) {
  const result = spawnSync(commandLine, {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

const includes = discoverIncludes()
const registry = writeRootRegistry(includes)

console.log(
  `registry: ${registry.name} — ${includes.length} item(s)\n${includes.map((i) => `  - ${i}`).join("\n") || "  (none)"}`
)

if (includes.length === 0) {
  console.warn("No registry/*/registry.json files found. Skipping validate/build.")
  process.exit(0)
}

run("pnpm dlx shadcn@latest registry validate ./registry.json")
run("pnpm dlx shadcn@latest build ./registry.json --output public/r")

console.log("Registry built → public/r")
