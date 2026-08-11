import { readdirSync, readFileSync, existsSync } from "node:fs"
import { join, relative, dirname } from "node:path"
import { fileURLToPath } from "node:url"

export const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..")
export const REGISTRY_DIR = join(ROOT, "registry")
export const ROOT_REGISTRY_PATH = join(ROOT, "registry.json")
export const BUILD_DIR = join(ROOT, "public", "r")

export const REGISTRY_SCHEMA = "https://ui.shadcn.com/schema/registry.json"
export const REGISTRY_ITEM_SCHEMA =
  "https://ui.shadcn.com/schema/registry-item.json"

/** File types allowed by the shadcn registry-item schema. */
export const REGISTRY_ITEM_TYPES = new Set([
  "registry:lib",
  "registry:block",
  "registry:component",
  "registry:ui",
  "registry:hook",
  "registry:page",
  "registry:file",
  "registry:style",
  "registry:theme",
  "registry:item",
])

/**
 * Discover per-component `registry.json` manifests inside `registry/`.
 * Returns POSIX-style paths relative to the project root, sorted.
 */
export function discoverIncludes(registryDir = REGISTRY_DIR, root = ROOT) {
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

export function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"))
}

export function readRootRegistry(rootRegistryPath = ROOT_REGISTRY_PATH) {
  return readJson(rootRegistryPath)
}

/**
 * Build the next root registry object from the current one plus discovered
 * includes. Pure — does not touch the filesystem.
 */
export function composeRootRegistry(current, includes) {
  return {
    $schema: current.$schema ?? REGISTRY_SCHEMA,
    name: current.name ?? "aloe-ui",
    homepage: current.homepage ?? "https://www.aloeui.com",
    include: includes,
  }
}

export function serializeRegistry(registry) {
  return `${JSON.stringify(registry, null, 2)}\n`
}

/** Resolve the absolute directory a per-component manifest lives in. */
export function manifestDir(includePath, root = ROOT) {
  return dirname(join(root, includePath))
}

/** Normalize line endings so comparisons ignore CRLF/LF differences. */
export function normalizeEol(text) {
  return text.replace(/\r\n/g, "\n")
}
