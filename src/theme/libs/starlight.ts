import type { StarlightUserConfig } from '@astrojs/starlight/types'

type StarlightComponents = NonNullable<StarlightUserConfig['components']>
type Override = keyof StarlightComponents

/**
 * Claim the components this theme needs, but never steal one the user already
 * overrode themselves — their override wins and we say so in the build log.
 */
export function overrideComponents(
  config: Pick<StarlightUserConfig, 'components'>,
  overrides: Override[],
  base: string,
  logger: { warn: (message: string) => void },
): StarlightComponents {
  const components = { ...config.components }

  for (const override of overrides) {
    if (components[override]) {
      logger.warn(
        `A \`<${override}>\` component override is already set — starlight-theme-commit-moi will not replace it. Remove it to get the themed version.`,
      )
      continue
    }
    components[override] = `${base}/components/${override}.astro`
  }

  return components
}
