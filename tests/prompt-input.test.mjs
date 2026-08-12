import { test } from "node:test"
import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { ROOT, BUILD_DIR, readJson } from "../scripts/registry-lib.mjs"

const SOURCE = join(ROOT, "registry/prompt-input/prompt-input.tsx")
const MANIFEST = join(ROOT, "registry/prompt-input/registry.json")
const BUILT = join(BUILD_DIR, "prompt-input.json")
const COMPONENTS_JSON = join(ROOT, "components.json")
const EXAMPLES = join(ROOT, "content/docs/components/prompt-input.examples.ts")
const DOCS = join(ROOT, "content/docs/components/prompt-input.mdx")

test("components.json uses the lucide icon library", () => {
  const config = readJson(COMPONENTS_JSON)
  assert.equal(config.iconLibrary, "lucide")
})

test("prompt-input depends on lucide-react, not phosphor", () => {
  const manifest = readJson(MANIFEST)
  const item = manifest.items.find((entry) => entry.name === "prompt-input")
  assert.ok(item, "prompt-input item missing")
  assert.deepEqual(item.dependencies, ["lucide-react"])
  assert.ok(
    !JSON.stringify(item).includes("@phosphor-icons"),
    "phosphor must not appear in the prompt-input manifest"
  )
})

test("prompt-input source imports lucide icons and targets aloe path", () => {
  const source = readFileSync(SOURCE, "utf8")
  assert.match(source, /from "lucide-react"/)
  assert.match(source, /PlusIcon/)
  assert.match(source, /SendHorizontalIcon/)
  assert.doesNotMatch(source, /@phosphor-icons\/react/)
  assert.doesNotMatch(source, /@remixicon\/react/)

  const manifest = readJson(MANIFEST)
  const item = manifest.items.find((entry) => entry.name === "prompt-input")
  assert.equal(
    item.files[0].target,
    "components/ui/aloe/prompt-input.tsx"
  )
})

test("built prompt-input.json ships lucide and the aloe install target", () => {
  assert.ok(existsSync(BUILT), "public/r/prompt-input.json missing")
  const built = readJson(BUILT)
  assert.deepEqual(built.dependencies, ["lucide-react"])
  assert.equal(built.files[0].target, "components/ui/aloe/prompt-input.tsx")
  assert.match(built.files[0].content, /from "lucide-react"/)
  assert.doesNotMatch(built.files[0].content, /@phosphor-icons\/react/)
})

test("prompt-input docs examples and install wiring stay in sync", () => {
  assert.ok(existsSync(EXAMPLES), "prompt-input.examples.ts missing")
  assert.ok(existsSync(DOCS), "prompt-input.mdx missing")

  const examples = readFileSync(EXAMPLES, "utf8")
  const docs = readFileSync(DOCS, "utf8")

  for (const name of [
    "promptInputDemo",
    "promptInputSizeSm",
    "promptInputSizeDefault",
    "promptInputSizeLg",
    "promptInputDefault",
    "promptInputOutline",
    "promptInputGhost",
  ]) {
    assert.match(examples, new RegExp(`export const ${name}`))
    assert.match(docs, new RegExp(`code=\\{${name}\\}`))
  }

  assert.match(docs, /<ComponentInstall/)
  assert.match(docs, /dependencies=\{\["lucide-react"\]\}/)
  assert.match(docs, /target="components\/ui\/aloe\/prompt-input\.tsx"/)
})
