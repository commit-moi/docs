import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightThemeCommitMoi from './src/theme/index.ts'

export default defineConfig({
  site: 'https://docs.commit.moi',
  integrations: [
    starlight({
      title: 'commit.moi docs',
      description: 'The user guide for commit.moi — your life, organized at last.',
      // The theme supplies the wordmark lockup, so no `logo` is needed.
      favicon: '/favicon.svg',
      // No `editLink` on purpose. This is published user documentation, not a
      // wiki — corrections come through us, not through drive-by pull requests.
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/commit-moi' }],
      // English only at launch; add `locales` when that changes.
      // Search is Pagefind (Starlight's default) — the theme restyles it.
      // Light only: no theme toggle is rendered.
      plugins: [
        starlightThemeCommitMoi({
          // themeBase: './src/theme',  // change only if you move the folder
          accent: 'steel',
          accentSwitch: true,
          trustLine: 'Nothing lives behind our UI that you can’t see on github.com.',
        }),
      ],
      // Sidebar labels are kept short on purpose — the rail is 248px, the
      // app's own sidebar width.
      sidebar: [
        {
          label: 'Start here',
          items: ['getting-started', 'tasks-and-areas', 'spaces', 'projects'],
        },
        {
          label: 'Capture',
          items: ['email-capture', 'keyboard-shortcuts'],
        },
        {
          label: 'Your data',
          items: ['your-data-and-github', 'account-and-settings'],
        },
        {
          label: 'Help',
          items: ['troubleshooting', { slug: 'changelog', badge: 'new' }],
        },
      ],
    }),
  ],
})
