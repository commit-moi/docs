import type { ViteUserConfig } from 'astro'

import type { StarlightThemeCommitMoiConfig } from './config'

const moduleId = 'virtual:starlight-theme-commit-moi/config'
const resolvedModuleId = `\0${moduleId}`

/** Exposes the plugin config to the theme's Astro components. */
export function vitePluginStarlightThemeCommitMoi(
  config: StarlightThemeCommitMoiConfig,
): NonNullable<ViteUserConfig['plugins']>[number] {
  return {
    name: 'vite-plugin-starlight-theme-commit-moi',
    resolveId(id) {
      return id === moduleId ? resolvedModuleId : undefined
    },
    load(id) {
      return id === resolvedModuleId
        ? `export default ${JSON.stringify(config)}`
        : undefined
    },
  }
}
