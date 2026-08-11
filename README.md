<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/header/graph.svg?title=Aloe+UI&subtitle=Opinionated+UI+components+for+shippers&logo=react&theme=zinc&align=center&mode=dark&bg=transparent" />
    <img alt="Aloe UI — Opinionated UI components for shippers" src="https://shieldcn.dev/header/graph.svg?title=Aloe+UI&subtitle=Opinionated+UI+components+for+shippers&logo=react&theme=zinc&align=center&mode=light&bg=transparent" />
  </picture>
</p>

<p align="center">  
  <a href="https://www.aloeui.com"> 
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/docs-aloeui.com-18181b.svg?variant=branded&logo=bookstack&mode=dark" />
      <img alt="Docs" src="https://shieldcn.dev/badge/docs-aloeui.com-fafafa.svg?variant=branded&logo=bookstack&mode=light" />
    </picture>
  </a>
  <a href="https://github.com/gochitashvili/aloe-ui/stargazers">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/stars/gochitashvili/aloe-ui.svg?variant=secondary&mode=dark" />
      <img alt="GitHub stars" src="https://shieldcn.dev/github/stars/gochitashvili/aloe-ui.svg?variant=secondary&mode=light" />
    </picture>
  </a>
  <a href="https://github.com/gochitashvili/aloe-ui/graphs/contributors">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/contributors/gochitashvili/aloe-ui.svg?variant=secondary&mode=dark" />
      <img alt="Contributors" src="https://shieldcn.dev/github/contributors/gochitashvili/aloe-ui.svg?variant=secondary&mode=light" />
    </picture>
  </a>
  <a href="https://github.com/gochitashvili/aloe-ui/commits/main">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/last-commit/gochitashvili/aloe-ui.svg?variant=secondary&mode=dark" />
      <img alt="Last commit" src="https://shieldcn.dev/github/last-commit/gochitashvili/aloe-ui.svg?variant=secondary&mode=light" />
    </picture>
  </a>
  <a href="https://ui.shadcn.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/registry-shadcn-18181b.svg?variant=secondary&logo=shadcnui&mode=dark" />
      <img alt="shadcn registry" src="https://shieldcn.dev/badge/registry-shadcn-fafafa.svg?variant=secondary&logo=shadcnui&mode=light" />
    </picture>
  </a>
</p>

**Aloe UI** is an open-source [shadcn/ui](https://ui.shadcn.com) registry of tasteful, opinionated UI components. Copy what you need, paste into your app, and ship — without fighting a kitchen-sink design system.

Site: [aloeui.com](https://www.aloeui.com) · Docs: [aloeui.com/docs](https://www.aloeui.com/docs)

## Why Aloe UI

Most kits hand you every option. Aloe UI picks a direction: spacing, motion, and interaction patterns that already feel finished. You can still override anything — you just start from a sharper baseline.

- **shadcn-native** — install with the CLI, own the source in your repo
- **Opinionated defaults** — less boilerplate, clearer decisions
- **Built to ship** — React, Tailwind, Motion where it earns its keep

## Quick start

Install a component:

```bash
pnpm dlx shadcn@latest add @aloe-ui/gooey-color-picker
```

Or pull straight from GitHub:

```bash
pnpm dlx shadcn@latest add gochitashvili/aloe-ui/gooey-color-picker
```

## Components

| Component | Install | Description |
| --- | --- | --- |
| [Gooey Color Picker](https://www.aloeui.com/docs/components/gooey-color-picker) | `@aloe-ui/gooey-color-picker` | Floating swatch → hue wheel, alpha, hex — joined by an SVG gooey filter |

```tsx
import { GooeyColorPicker } from "@/components/ui/gooey-color-picker"

export function Example() {
  return (
    <GooeyColorPicker
      defaultValue={{ h: 210, s: 90, l: 55, a: 1 }}
      onChange={(color, css) => console.log(color, css)}
    />
  )
}
```

## Develop locally

This repo is the docs site and registry source.

```bash
pnpm install
pnpm dev
```

Useful scripts:

| Script | What it does |
| --- | --- |
| `pnpm dev` | Next.js dev server |
| `pnpm build` | Build registry + production app |
| `pnpm start` | Start production server |
| `pnpm registry:build` | Emit `public/r/*.json` from `registry/` |
| `pnpm test` | Run registry tests |
| `pnpm typecheck` | MDX + TypeScript check |

Stack: Next.js 16, React 19, Fumadocs, Tailwind CSS 4, shadcn/ui (Base UI).

### Deploy to Vercel

Connect the repo in the [Vercel dashboard](https://vercel.com/new). Framework is Next.js; install/build commands are set in `vercel.json` (`pnpm install` / `pnpm build`).

## Contributing

New components live under `registry/<name>/` with a `registry.json`, then get documented in `content/docs/components/`. Run `pnpm registry:build` before shipping registry changes.

PRs that sharpen defaults, fix edge cases, or add tasteful components are welcome.

## Links

- [Documentation](https://www.aloeui.com/docs)
- [Registry index](https://www.aloeui.com/r/registry.json)
- [shadcn/ui](https://ui.shadcn.com)

---

[github.com/gochitashvili/aloe-ui](https://github.com/gochitashvili/aloe-ui)
