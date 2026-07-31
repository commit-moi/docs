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

Needs **Astro ≥ 7.0.2** and **Starlight ≥ 0.41.5** (the range Starlight itself
declares). Verified on Astro 7.1.6 / Starlight 0.41.5: Vite 8 loads the virtual
config module fine, and `:::` directives render unchanged under the new
Markdown processor.

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

The `astro.config.ts` shipped in `repo-starter/` alongside this folder is the
full config, including the sidebar IA. If you put the theme somewhere other than
`src/theme`, pass `themeBase: './your/path'`.

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
bridge — `--docs-sidebar-w` (248px), `--docs-content-w` (820px), `--docs-toc-w`
(232px), `--docs-nav-h`, and `--code-bg` (a `color-mix` of the alt section fill
and paper). No new hex enters the system.

Two width facts worth knowing:

- **Article pages** use `--docs-content-w` (820px), flush beside the rail.
- **Splash pages** (no sidebar) are centred and wider. Starlight sets their width
  from an UNLAYERED rule in `Page.astro`, and unlayered declarations beat every
  `@layer` regardless of specificity — so the theme's override sits at the very
  bottom of `base.css`, **outside** `@layer commit-moi`. It is the only rule in
  the theme that does. If you move it into the layer it silently stops working
  and the home page snaps back to Starlight's 67.5rem.

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
   ├── index.ts                  barrel for the content-facing components
   │
   │  ── Starlight overrides ──
   ├── Banner.astro          W   body-start accent application
   ├── Head.astro            W   color-scheme: light
   ├── Header.astro          W   + "Open app →"
   ├── Footer.astro          W   + the landing page's footer
   ├── Sidebar.astro         W   wordmark + accent switch + trust line
   ├── SiteTitle.astro       R   mobile lockup (desktop wordmark is in the sidebar)
   ├── PageTitle.astro       R   Lora 700 title + description as a deck line
   ├── Hero.astro            R   splash hero + app mockup in window chrome
   ├── ThemeSelect.astro     R   empty — light only
   │
   │  ── for use in content ──
   ├── Card.astro                icon card, with or without a link
   ├── IndexList.astro           two columns of hairline rows
   ├── IndexRow.astro            one such row: title + description, one line
   ├── Latest.astro              the newest release, above the section grids
   ├── TrustBand.astro           one proof line as a rule between sections
   └── Icon.astro                the Lucide glyphs the docs use, vendored
```

**W** wraps Starlight's component (`<Default>` + our additions) · **R** replaces it.

### The rule for overrides: replaced means restyled

Astro **scopes** component CSS. A component that *wraps* `<Default>` keeps
Starlight's styles; a component that *replaces* it inherits **none** of them —
including layout. That is why every **R** component's CSS lives in
`styles/base.css` rather than in a `<style>` block: one file for docs chrome,
and no rule can go missing because a component was swapped.

If you replace one more, port its layout to `base.css` in the same commit.

### Content-facing components

```mdx
import { CardGrid } from '@astrojs/starlight/components';
import { Card, TrustBand } from '@theme/components';

<CardGrid>
  <Card title="Spaces" icon="layout-grid" href="/spaces/">
    One private repo per part of your life.
  </Card>
</CardGrid>

<IndexList>
  <IndexRow title="Changelog" href="/changelog/">What shipped, newest first.</IndexRow>
</IndexList>

<TrustBand href="/your-data-and-github/" cta="Your data & GitHub">
  If commit.moi disappeared tomorrow, nothing happens to your tasks.
</TrustBand>
```

**`<Latest>` goes above the grids.** The changelog is what a returning reader
came for, so the home page leads with one release and one line; the changelog
page carries the history.

**Four asides, four meanings, both themes.** Starlight's `:::note`, `:::tip`,
`:::caution` and `:::danger` map to steel, forest, amber and red — all on
SEMANTIC tokens that do NOT move with the accent. That is deliberate: when the
accent is Forest, an accent-tinted note would read identically to a tip.

```md
:::note        steel   — how something works
:::tip[Title]  forest  — a better way to do it
:::caution     amber   — you can lose something
:::danger      red     — you can lose something permanently
```

**Never put a link in a card body or a row description.** The card and the row
*are* links; a second target inside them competes with the first. The theme
neutralises one if it appears (so an autolinked email address can't change a
row's height, colour and underline — it did, three times), but the content should
not create one. In MDX a bare address autolinks, so write it as a string
expression: `{'assistant@commit.moi'}`.

**Cards lead, rows list.** `<CardGrid>` + `<Card>` for the sections a page wants
you to start with; `<IndexList>` + `<IndexRow>` for the rest. Giving both the
same weight flattens the page — that difference is the whole point of having
two.

`@theme/*` is the tsconfig path alias to `src/theme/*`. Everything else —
`<Aside>`, `<Steps>`, `<Tabs>`, `<CardGrid>`, `<FileTree>` — is Starlight's own
and needs no replacement.

**Why a card of our own:** Starlight's `<Card>` only takes a glyph from its
built-in set, which has none of the app's, and its `<LinkCard>` takes no icon at
all. `Icon.astro` vendors the Lucide paths the docs use — no dependency, no
network.

`Icon.astro` **throws at build time** on a name it doesn't have, listing what it
does. That is deliberate: a missing glyph is a broken page, so it should fail the
build rather than render an empty box. The 31 names currently vendored:

```
archive · arrow-right · calendar · calendar-clock · check · check-check
chef-hat · git-commit-horizontal · goal · inbox · info · keyboard · layers
layout-grid · life-buoy · lightbulb · lock · mail · network · notebook-pen
octagon-alert · plus · refresh-cw · rocket · scroll-text · search · settings
shield-check · square-check-big · triangle-alert · user
```

To add one, paste its `<svg>` innards from lucide.dev into the map (2px stroke,
24×24 viewBox) and **reuse the app's glyph for a concept** rather than picking a
new one — `square-check-big` tasks, `layout-grid` spaces, `goal` projects,
`git-commit-horizontal` GitHub.

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
- **Type comes from the scale, never from a number you chose.** Every
  `font-size` in this theme is a `--text-*` token from
  `colors_and_type.css` — 11 · 12 · 13 · 15 · 16 · 18 · 20 · 28 · 32 · 44, the
  same scale the app uses (see the design system's *Display Type* and *UI & Body
  Type* cards). There is no 14, no 17, no 13.5. If a step seems to be missing it
  is missing from the design system: file a `design-request` instead of picking
  an in-between value. The one exception is the hero mockup in `Hero.astro`,
  which is a proportional ~0.7 miniature of the app and says so in its comment.
- **Lora is for page titles, sidebar group labels and splash-page section
  headers.** In-page headings on ARTICLE pages are DM Sans 500 so a long page
  stays scannable; a splash page is a marketing surface read in one pass, so its
  `h2`s are Lora (scoped by `html:not([data-has-sidebar])`).
- **Section rules go on `.sl-heading-wrapper`, not the heading.** Starlight sets
  headings `display: inline` so the anchor link shares their line, and a
  `border-top` on an inline box is only as wide as its text.
- **Sidebar labels stay short** — the rail is 248px. Put the detail in the page,
  not the nav ("Email capture", not "Email capture (assistant@commit.moi)").
- **Style the OUTER header only** (`header.header`). Starlight nests two
  `class="header"` elements; a bare `.header` selector hits both and breaks the
  inner bar's 3-column grid.
- **Icons are Lucide**, 2px stroke, 16–20px, inheriting text colour. Reuse the
  app's glyph for a concept (`square-check-big` tasks · `layout-grid` spaces ·
  `goal` projects · `git-commit-horizontal` GitHub) instead of picking a new one.
- **A replaced override carries its own layout to `base.css`.** See above.
- **One trust line per page**, at most, and never invent the wording.
- **Never wrap a slot in `<p>`, `<span>` or `<a>`.** MDX hands a component
  *block* markup, so those wrappers get unnested by the parser — empty
  paragraphs at best, a torn-apart layout at worst. Wrap in a `<div>` and set
  the type one level down (`.cm-band-text p`, `.cm-card-body`). The same rule
  is why the card links its title instead of wrapping itself in an anchor.
- **Reset Starlight's prose margin inside any container you own.** Its
  sibling-spacing rule is not limited to direct children, so a 16px `margin-top`
  lands on your grid/flex children and becomes part of the cell — it stretched
  the index rows to 72px and turned a 12px `gap` into a 28px rhythm. Add the
  container to the `:is(.cm-index, .cm-band, .cm-latest) > *` reset in
  `base.css` and let `gap` be the only spacing authority.
- **Font-relative units don't travel.** `ch`, `em` and `ex` are measured in the
  font *and size* of the element carrying them, so moving a `max-width: 70ch`
  to a wrapper silently re-measures it in whatever that wrapper inherited. Set
  `font-family` and `font-size` on the element that owns the unit — see
  `.cm-band-text`.

## Verified against Starlight 0.41.5

Three things in this theme depend on Starlight's internal DOM. If you upgrade
Starlight and the chrome looks wrong, re-check these first:

1. **Two nested `class="header"` elements** — `PageFrame.astro` renders the fixed
   `<header class="header">`; `Header.astro` renders a `<div class="header">`
   inside it that owns the 3-column bar grid. Chrome rules target
   `header.header`; the inner div only gets `flex: 1`.
2. **`<Banner>` is the first thing inside `<main>`** — the earliest override that
   can touch `<body>`, which is why the accent script lives there.
3. **The TOC column is a SIBLING of `.main-pane`** (`TwoColumnContent.astro`), so
   the footer spans it with a negative inline-end margin, and both columns are
   pinned from `--docs-toc-w` rather than Starlight's free-space formulas.

## Design reference

The intended rendering lives one level up, in `../DocsTemplate.dc.html` (article
page) and `../DocsHome.dc.html` (splash home) — open them in the design system.
When the CSS and the template disagree, the template is the spec.
