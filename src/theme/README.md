# starlight-theme-commit-moi

commit.moi's own [Starlight](https://starlight.astro.build) theme — the app's
token layer applied to a documentation site. Warm paper, warm ink, hairlines
instead of shadows, one swappable accent, Lora for titles only.

**Vendored, not published.** Copy this folder to `docs/src/theme/` in the
`commit-moi/docs` repo and edit it in place. Nothing is fetched from npm.

**Light only.** The product has no dark mode, so neither does its manual: the
theme locks the light values for `data-theme="light"` *and* `"dark"` and removes
Starlight's theme toggle. The one appearance control is the accent switch
(Steel ⇄ Forest), mirroring the app's sidebar dots.

Structure follows [starlight-theme-black](https://github.com/adrian-ub/starlight-theme-black)
(MIT) — layered CSS, a token map, a small set of component overrides — with
commit.moi's own design system in place of its palette and type.

## Install

```sh
cp -R starlight-theme-commit-moi <docs-repo>/src/theme
```

```js
// astro.config.mjs
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightThemeCommitMoi from './src/theme/index.ts'

export default defineConfig({
  site: 'https://docs.commit.moi',
  integrations: [
    starlight({
      title: 'commit.moi docs',
      plugins: [starlightThemeCommitMoi()],
      sidebar: [/* … */],
    }),
  ],
})
```

Add the virtual-module types to the project's `src/env.d.ts`:

```ts
/// <reference types="./theme/virtual.d.ts" />
```

`astro.config.example.ts` is the full reference config, including the sidebar IA.
If you put the folder somewhere else, pass `themeBase: './your/path'`.

## Options

| Option | Type | Default | What it does |
|---|---|---|---|
| `themeBase` | `string` | `'./src/theme'` | Where this folder lives, from the project root. |
| `accent` | `'steel' \| 'forest'` | `'steel'` | Default accent ramp. |
| `accentSwitch` | `boolean` | `true` | Two accent dots in the sidebar footer; persists to `localStorage['commit-moi-accent']`. |
| `trustLine` | `string \| false` | *(strongest proof line)* | One quiet line at the bottom of the sidebar. |
| `anthem` | `string \| false` | `every task is an issue. …` | Line under the splash hero. |
| `footerNote` | `string` | *(landing signature)* | Footer note, HTML allowed. |
| `appUrl` | `string` | `https://commit.moi` | Where the wordmark points. |

## Three stylesheets, three change cadences

This is the whole architecture, and the reason it is split this way:

| File | Answers | Changes when |
|---|---|---|
| `styles/colors_and_type.css` | *What are commit.moi's colours and type?* | The design system changes. **It is the design system's own file, byte for byte** — same name, same bytes, the file devapp consumes. Never hand-edit: copy it again. |
| `styles/starlight-bridge.css` | *How should Starlight use them?* | Starlight is upgraded, or a `--sl-*` token is added. Contains no hex codes. |
| `styles/base.css` | *What does the docs chrome look like?* | The docs design changes. |
| `styles/layers.css` | Layer order (`starlight`, then `commit-moi`). | Never. |

So a brand change is a file copy, a Starlight upgrade touches one file, and a
docs redesign touches another. The docs-only values live at the top of the
bridge — `--docs-sidebar-w` (220px, the app's own sidebar), `--docs-content-w`,
`--docs-toc-w`, `--docs-nav-h`, and `--code-bg` (a `color-mix` of the alt
section fill and paper). All derived; no new hex enters the system.

### Keeping tokens.css in sync

```sh
cp <design-system>/colors_and_type.css src/theme/styles/
cp -R <design-system>/fonts src/theme/styles/   # only if the fonts changed
```

A checksum against the design system's copy is the whole verification: if the
files differ, the docs site has drifted.

### Fonts

Self-hosted from `styles/fonts/` — Lora (variable, upright + italic), DM Sans
(variable, upright + italic), DM Mono (400/500). `colors_and_type.css`
`@font-face`s them with paths relative to itself, so **`fonts/` must stay
inside `styles/`**. No CDN, no font provider, no network at build time.

### The accent swap

`colors_and_type.css` already carries the design system's `[data-theme="forest"]` block,
so this theme re-declares **nothing**. It applies that attribute to `<body>` —
never `<html>`, which Starlight owns for light/dark — from the `Banner`
override, before first paint. There is exactly one source for the accent ramp.

## What's in it

```
src/theme/
├── index.ts                     plugin: overrides, customCss, Expressive Code
├── libs/{config,starlight,vite}.ts
├── virtual.d.ts                 types for the config virtual module
├── styles/
│  ├── layers.css                @layer starlight, commit-moi
│  ├── colors_and_type.css       the design system's own file, verbatim
│  ├── fonts/                    Lora · DM Sans · DM Mono (brand-supplied)
│  ├── starlight-bridge.css      every --sl-* → a commit.moi token
│  └── base.css                  header, sidebar, prose, code, asides, cards…
└── components/
   ├── Banner.astro              body-start accent application (+ Starlight's banner)
   ├── Head.astro                color-scheme: light
   ├── SiteTitle.astro           mobile lockup (desktop wordmark is in the sidebar)
   ├── Sidebar.astro             wordmark + nav + accent switch + trust line
   ├── ThemeSelect.astro         empty — light only
   ├── PageTitle.astro           Lora 700 title + description as a deck line
   ├── Footer.astro              Starlight footer + the landing page's footer
   └── Hero.astro                splash hero + app mockup in window chrome
```

## Rules for anyone editing this theme

- **Never hardcode the accent.** Read `--accent`, `--accent-hover`,
  `--accent-mid`, `--accent-light`, `--accent-tint`. Both ramps must work.
- **No new colours.** If a value is missing, it is missing from the design
  system — file a `design-request` (see the design system's README) rather than
  inventing a hex here.
- **Borders over shadows.** Only floating surfaces (search modal, mockup) carry
  one, and it stays soft.
- **No gradients, no imagery, no glassmorphism, no bouncy motion.** Transitions
  are 150–200ms opacity/colour on `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Lora is for the page title and sidebar group labels.** In-page headings are
  DM Sans 500 so long pages stay scannable.
- **Sidebar labels stay short** — the rail is 220px. Put the detail in the page,
  not the nav ("Email capture", not "Email capture (assistant@commit.moi)").
- **Icons are Lucide**, 2px stroke, 16–20px, inheriting text colour. Reuse the
  app's glyph for a concept (`square-check-big` tasks · `layout-grid` spaces ·
  `goal` projects · `git-commit-horizontal` GitHub) instead of picking a new one.

## Design reference

The intended rendering lives in the design system's Templates group:
`templates/docs/Docs.dc.html` (article page) and
`templates/docs-home/DocsHome.dc.html` (splash home). When CSS and template
disagree, the template is the spec.
