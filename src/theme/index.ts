import type { StarlightPlugin } from '@astrojs/starlight/types'

import { StarlightThemeCommitMoiConfigSchema, type StarlightThemeCommitMoiUserConfig } from './libs/config'
import { overrideComponents } from './libs/starlight'
import { vitePluginStarlightThemeCommitMoi } from './libs/vite'

/**
 * commit.moi's Starlight theme — vendored, not published.
 *
 * Copy this folder to `docs/src/theme/` and add the plugin. If you move it,
 * pass the new location as `themeBase` (project-root-relative, no trailing
 * slash) so the CSS and component overrides still resolve.
 *
 * Warm paper, warm ink, one swappable accent. Light only, on purpose: the
 * product has no dark mode, so neither does its manual.
 */
export default function starlightThemeCommitMoi(
  userConfig?: StarlightThemeCommitMoiUserConfig,
): StarlightPlugin {
  const parsedConfig = StarlightThemeCommitMoiConfigSchema.safeParse(userConfig ?? {})

  if (!parsedConfig.success) {
    throw new Error(
      `The provided starlight-theme-commit-moi configuration is invalid.\n${parsedConfig.error.issues
        .map((issue) => issue.message)
        .join('\n')}`,
    )
  }

  const config = parsedConfig.data
  const base = config.themeBase.replace(/\/$/, '')

  return {
    name: 'starlight-theme-commit-moi',
    hooks: {
      'config:setup': function ({ config: starlightConfig, logger, updateConfig, addIntegration }) {
        const userExpressiveCodeConfig =
          starlightConfig.expressiveCode === false || starlightConfig.expressiveCode === true
            ? {}
            : starlightConfig.expressiveCode ?? {}

        updateConfig({
          components: overrideComponents(
            starlightConfig,
            ['Banner', 'Head', 'Header', 'Hero', 'PageTitle', 'Sidebar', 'SiteTitle', 'ThemeSelect', 'Footer'],
            base,
            logger,
          ),

          /* Order is the cadence order: layer declaration → brand tokens →
             Starlight bridge → docs chrome. colors_and_type.css is the design
             system's own file, verbatim, and it @font-faces the three brand
             families from `styles/fonts/` — keep them together. */
          customCss: [
            `${base}/styles/layers.css`,
            `${base}/styles/colors_and_type.css`,
            `${base}/styles/starlight-bridge.css`,
            `${base}/styles/base.css`,
            ...(starlightConfig.customCss ?? []),
          ],

          // One light code theme only — the paper fill and hairline come from
          // the design system, so the highlighter just supplies ink colours.
          expressiveCode:
            starlightConfig.expressiveCode === false
              ? false
              : {
                  themes: ['github-light'],
                  useDarkModeMediaQuery: false,
                  ...userExpressiveCodeConfig,
                  styleOverrides: {
                    borderRadius: 'var(--radius-md)',
                    borderColor: 'var(--border)',
                    borderWidth: '1px',
                    codeBackground: 'var(--code-bg)',
                    codeFontFamily: 'var(--font-mono)',
                    codeFontSize: 'var(--text-sm)',
                    codeLineHeight: '1.7',
                    codePaddingBlock: '14px',
                    codePaddingInline: '16px',
                    gutterBorderColor: 'var(--border)',
                    focusBorder: 'var(--accent-mid)',
                    uiFontFamily: 'var(--font-ui)',
                    uiFontSize: 'var(--text-xs)',
                    scrollbarThumbColor: 'var(--border-strong)',
                    ...userExpressiveCodeConfig?.styleOverrides,
                    frames: {
                      shadowColor: 'transparent',
                      editorBackground: 'var(--code-bg)',
                      terminalBackground: 'var(--code-bg)',
                      editorTabBarBackground: 'var(--bg)',
                      editorActiveTabBackground: 'var(--surface)',
                      editorActiveTabIndicatorTopColor: 'transparent',
                      editorActiveTabIndicatorBottomColor: 'var(--accent)',
                      editorTabBarBorderBottomColor: 'var(--border)',
                      terminalTitlebarBackground: 'var(--bg)',
                      terminalTitlebarBorderBottomColor: 'var(--border)',
                      terminalTitlebarDotsForeground: 'var(--border-strong)',
                      terminalTitlebarDotsOpacity: '1',
                      inlineButtonBackground: 'var(--surface)',
                      inlineButtonBorder: 'var(--border)',
                      inlineButtonForeground: 'var(--fg2)',
                      tooltipSuccessBackground: 'var(--accent)',
                      ...userExpressiveCodeConfig?.styleOverrides?.frames,
                    },
                    textMarkers: {
                      markBackground: 'var(--accent-tint-12)',
                      markBorderColor: 'var(--accent-mid)',
                      insBackground: 'var(--forest-tint)',
                      insBorderColor: 'var(--forest)',
                      delBackground: 'var(--error-bg)',
                      delBorderColor: 'var(--error-border)',
                      ...userExpressiveCodeConfig?.styleOverrides?.textMarkers,
                    },
                  },
                },
        })

        // Exposes the plugin config to the theme's Astro components.
        addIntegration({
          name: 'starlight-theme-commit-moi-integration',
          hooks: {
            'astro:config:setup': ({ updateConfig }) => {
              updateConfig({ vite: { plugins: [vitePluginStarlightThemeCommitMoi(config)] } })
            },
          },
        })
      },
    },
  }
}
