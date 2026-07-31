/* Components the docs CONTENT can use, over and above Starlight's own set:
 *
 *   import { Card, TrustBand } from '@theme/components'
 *
 * (`@theme/*` is the tsconfig path alias to `src/theme/*`.)
 * Starlight's <CardGrid>, <Aside>, <Steps>, <Tabs> etc. are unchanged — import
 * those from '@astrojs/starlight/components' as usual.
 */
export { default as Card } from './Card.astro'
export { default as TrustBand } from './TrustBand.astro'
export { default as Icon } from './Icon.astro'
