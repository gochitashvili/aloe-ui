import { test } from "node:test"
import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { join, basename } from "node:path"

import {
  ROOT,
  BUILD_DIR,
  REGISTRY_SCHEMA,
  REGISTRY_ITEM_SCHEMA,
  REGISTRY_ITEM_TYPES,
  discoverIncludes,
  readRootRegistry,
  readJson,
  composeRootRegistry,
  manifestDir,
  normalizeEol,
} from "../scripts/registry-lib.mjs"

const rootRegistry = readRootRegistry()
const includes = discoverIncludes()

/** [{ include, dir, manifest, item }] flattened across every manifest. */
const items = includes.flatMap((include) => {
  const dir = manifestDir(include)
  const manifest = readJson(join(ROOT, include))
  return (manifest.items ?? []).map((item) => ({ include, dir, manifest, item }))
})

test("root registry.json is well-formed", () => {
  assert.equal(rootRegistry.$schema, REGISTRY_SCHEMA)
  assert.equal(typeof rootRegistry.name, "string")
  assert.ok(rootRegistry.name.length > 0, "name must not be empty")
  assert.equal(typeof rootRegistry.homepage, "string")
  assert.ok(Array.isArray(rootRegistry.include), "include must be an array")
})

test("root registry include list is in sync with registry/ contents", () => {
  assert.deepEqual(
    rootRegistry.include,
    includes,
    "registry.json is stale — run `pnpm registry:build`"
  )
})

test("composeRootRegistry preserves identity for a synced registry", () => {
  const recomposed = composeRootRegistry(rootRegistry, includes)
  assert.deepEqual(recomposed, {
    $schema: rootRegistry.$schema,
    name: rootRegistry.name,
    homepage: rootRegistry.homepage,
    include: includes,
  })
})

test("at least one registry item is defined", () => {
  assert.ok(items.length > 0, "expected the registry to contain components")
})

test("every included manifest exists and is valid JSON with items", () => {
  for (const include of includes) {
    const path = join(ROOT, include)
    assert.ok(existsSync(path), `missing manifest: ${include}`)
    const manifest = readJson(path)
    assert.ok(
      Array.isArray(manifest.items) && manifest.items.length > 0,
      `${include} must declare a non-empty items array`
    )
  }
})

test("item names are unique across the whole registry", () => {
  const names = items.map(({ item }) => item.name)
  assert.equal(
    new Set(names).size,
    names.length,
    `duplicate item names: ${names.join(", ")}`
  )
})

for (const { include, dir, item } of items) {
  const label = `${include} › ${item.name ?? "(unnamed)"}`

  test(`${label}: required fields`, () => {
    assert.equal(typeof item.name, "string")
    assert.match(item.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, "name must be kebab-case")
    assert.equal(typeof item.title, "string")
    assert.ok(item.title.length > 0, "title must not be empty")
    assert.equal(typeof item.description, "string")
    assert.ok(item.description.length > 0, "description must not be empty")
    assert.ok(
      REGISTRY_ITEM_TYPES.has(item.type),
      `unknown item type: ${item.type}`
    )
    assert.ok(Array.isArray(item.files) && item.files.length > 0, "files required")
  })

  test(`${label}: declared dependencies are non-empty strings`, () => {
    for (const key of ["dependencies", "devDependencies", "registryDependencies"]) {
      if (item[key] === undefined) continue
      assert.ok(Array.isArray(item[key]), `${key} must be an array`)
      for (const dep of item[key]) {
        assert.equal(typeof dep, "string")
        assert.ok(dep.length > 0, `${key} contains an empty entry`)
      }
    }
  })

  test(`${label}: referenced files exist on disk`, () => {
    for (const file of item.files) {
      assert.equal(typeof file.path, "string", "file.path required")
      assert.ok(
        REGISTRY_ITEM_TYPES.has(file.type),
        `unknown file type: ${file.type}`
      )
      const abs = join(dir, file.path)
      assert.ok(existsSync(abs), `missing source file: ${file.path} (in ${include})`)
    }
  })
}

test("built output directory exists", () => {
  assert.ok(
    existsSync(BUILD_DIR),
    "public/r missing — run `pnpm registry:build`"
  )
})

test("built registry.json lists exactly the source items", () => {
  const builtPath = join(BUILD_DIR, "registry.json")
  assert.ok(existsSync(builtPath), "public/r/registry.json missing")
  const built = readJson(builtPath)
  const builtNames = (built.items ?? []).map((i) => i.name).sort()
  const sourceNames = items.map(({ item }) => item.name).sort()
  assert.deepEqual(
    builtNames,
    sourceNames,
    "public/r is stale — run `pnpm registry:build`"
  )
})

for (const { dir, item } of items) {
  test(`built ${item.name}.json matches its source`, () => {
    const builtPath = join(BUILD_DIR, `${item.name}.json`)
    assert.ok(existsSync(builtPath), `public/r/${item.name}.json missing`)

    const built = readJson(builtPath)
    assert.equal(built.$schema, REGISTRY_ITEM_SCHEMA)
    assert.equal(built.name, item.name)
    assert.equal(built.type, item.type)
    assert.equal((built.files ?? []).length, item.files.length)

    for (const sourceFile of item.files) {
      const builtFile = built.files.find(
        (f) => basename(f.path) === basename(sourceFile.path)
      )
      assert.ok(builtFile, `built output missing file ${sourceFile.path}`)
      assert.equal(builtFile.type, sourceFile.type)
      assert.equal(typeof builtFile.content, "string")
    }
  })
}

for (const { dir, item } of items) {
  test(`built ${item.name}.json inlines current file content`, () => {
    const built = readJson(join(BUILD_DIR, `${item.name}.json`))
    for (const sourceFile of item.files) {
      const builtFile = built.files.find(
        (f) => basename(f.path) === basename(sourceFile.path)
      )
      const diskContent = normalizeEol(
        readFileSync(join(dir, sourceFile.path), "utf8")
      )
      assert.equal(
        normalizeEol(builtFile.content),
        diskContent,
        `${item.name}: built content is stale for ${sourceFile.path} — run \`pnpm registry:build\``
      )
    }
  })
}
