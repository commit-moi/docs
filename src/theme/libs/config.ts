import { z } from 'astro/zod'

export const StarlightThemeCommitMoiConfigSchema = z
  .object({
    /**
     * Where this folder lives, relative to the Astro project root. Vendored
     * default: `./src/theme`. Change it if you move the folder — the CSS and
     * the component overrides are resolved from here.
     */
    themeBase: z.string().default('./src/theme'),
    /**
     * Default accent. `steel` is the product default; `forest` is the second
     * app theme. Only the accent ramp moves — paper, ink and hairlines never do.
     */
    accent: z.enum(['steel', 'forest']).default('steel'),
    /**
     * Show the two accent dots in the sidebar footer, mirroring the app's
     * theme switch. The choice persists in `localStorage` under
     * `commit-moi-accent`, so docs and app can share it on the same origin.
     */
    accentSwitch: z.boolean().default(true),
    /**
     * One trust line, shown quietly at the bottom of the sidebar.
     * Keep it to a single sentence from the design system's ranked list
     * (see the Voice — Trust Lines card). Set to `false` to omit.
     */
    trustLine: z
      .union([z.string(), z.literal(false)])
      .default('Nothing lives behind our UI that you can’t see on github.com.'),
    /** Anthem line under the splash hero. `false` to omit. */
    anthem: z
      .union([z.string(), z.literal(false)])
      .default('every task is an issue. every space is a repo. every byte is yours.'),
    /** Footer note — the landing page's signature, reused verbatim. */
    footerNote: z
      .string()
      .default('Open source · GitHub-backed · Coded with ❤️ in Barcelona © 2026 cknyco'),
    /** Where the wordmark points. */
    appUrl: z.string().default('https://commit.moi'),
  })
  .default({})

export type StarlightThemeCommitMoiUserConfig = z.input<typeof StarlightThemeCommitMoiConfigSchema>
export type StarlightThemeCommitMoiConfig = z.output<typeof StarlightThemeCommitMoiConfigSchema>
