import { spawnSync } from "node:child_process"
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..")
const registryDir = join(root, "registry")
const rootRegistryPath = join(root, "registry.json")

function discoverIncludes() {
  if (!existsSync(registryDir)) {
    return []
  }

  return readdirSync(registryDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(registryDir, entry.name, "registry.json"))
    .filter((path) => existsSync(path))
    .map((path) => relative(root, path).replaceAll("\\", "/"))
    .sort()
}

function writeRootRegistry(includes) {
  const current = JSON.parse(readFileSync(rootRegistryPath, "utf8"))
  const next = {
    $schema:
      current.$schema ?? "https://ui.shadcn.com/schema/registry.json",
    name: current.name ?? "23rd",
    homepage: current.homepage ?? "https://23rd.dev",
    include: includes,
  }
  writeFileSync(rootRegistryPath, `${JSON.stringify(next, null, 2)}\n`)
  return next
}

function run(commandLine) {
  const result = spawnSync(commandLine, {
    cwd: root,
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
