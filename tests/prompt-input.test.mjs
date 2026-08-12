import { test } from "node:test"
import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { ROOT, BUILD_DIR, readJson } from "../scripts/registry-lib.mjs"

const SOURCE = join(ROOT, "registry/prompt-input/prompt-input.tsx")
const MANIFEST = join(ROOT, "registry/prompt-input/registry.json")
const BUILT = join(BUILD_DIR, "prompt-input.json")
const EXAMPLES = join(ROOT, "content/docs/components/prompt-input.examples.ts")
const DOCS = join(ROOT, "content/docs/components/prompt-input.mdx")
const META = join(ROOT, "content/docs/components/meta.json")
const PREVIEW = join(ROOT, "content/docs/components/prompt-input.preview.tsx")

test("prompt-input is a div shell; InputGroup is composed outside", () => {
  const source = readFileSync(SOURCE, "utf8")
  const manifest = readJson(MANIFEST)
  const item = manifest.items.find((entry) => entry.name === "prompt-input")

  assert.ok(item, "prompt-input item missing")
  assert.equal(item.type, "registry:block")
  assert.equal(item.files[0].target, "components/prompt-input.tsx")
  assert.equal(item.registryDependencies, undefined)
  assert.equal(item.dependencies, undefined)

  assert.match(source, /const promptInputVariants = cva\(/)
  assert.match(source, /ComponentProps<"div">/)
  assert.match(source, /<div/)
  assert.match(source, /data-slot="prompt-input"/)
  assert.match(source, /data-size=\{size\}/)
  assert.match(source, /data-variant=\{variant\}/)
  assert.doesNotMatch(source, /from "@\/components\/ui\/input-group"/)
  assert.doesNotMatch(source, /<InputGroup/)
  assert.doesNotMatch(source, /DropdownMenu/)
  assert.doesNotMatch(source, /lucide-react/)
})

test("built prompt-input.json ships as a div shell block", () => {
  assert.ok(existsSync(BUILT), "public/r/prompt-input.json missing")
  const built = readJson(BUILT)
  assert.equal(built.type, "registry:block")
  assert.match(built.files[0].content, /promptInputVariants/)
  assert.match(built.files[0].content, /<div/)
  assert.doesNotMatch(built.files[0].content, /from "@\/components\/ui\/input-group"/)
  assert.doesNotMatch(built.files[0].content, /<InputGroup/)
})

test("prompt-input docs compose InputGroup outside the shell", () => {
  const examples = readFileSync(EXAMPLES, "utf8")
  const docs = readFileSync(DOCS, "utf8")
  const preview = readFileSync(PREVIEW, "utf8")
  const meta = readJson(META)

  assert.match(examples, /export const promptInputDemo/)
  assert.match(examples, /export const promptInputSizeSm/)
  assert.match(examples, /export const promptInputSizeLg/)
  assert.match(examples, /export const promptInputOutline/)
  assert.match(examples, /export const promptInputGhost/)
  assert.match(examples, /size="sm"/)
  assert.match(examples, /size="lg"/)
  assert.match(examples, /variant="outline"/)
  assert.match(examples, /variant="ghost"/)
  assert.match(examples, /<InputGroup>/)
  assert.match(preview, /<InputGroup>/)
  assert.match(docs, /code=\{promptInputSizeSm\}/)
  assert.match(docs, /code=\{promptInputOutline\}/)
  assert.match(docs, /registryDependencies=\{\["input-group", "dropdown-menu"\]\}/)
  assert.match(docs, /target="components\/prompt-input\.tsx"/)
  assert.deepEqual(meta.pages, ["---AI Blocks---", "prompt-input"])
})
