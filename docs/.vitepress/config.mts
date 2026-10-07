import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

// written by scripts/generate.mjs, which `npm run dev` and `npm run build` call first
const sidebarFile = fileURLToPath(new URL('../reference/sidebar.json', import.meta.url))
const referenceSidebar = existsSync(sidebarFile) ? JSON.parse(readFileSync(sidebarFile, 'utf8')) : []

const repo = 'https://github.com/xRookieFight/VortexAPI-Docs'

export default defineConfig({
  title: 'Vortex API',
  description: 'Community reference for scripting Vortex games in Luau.',
  lang: 'en-US',
  // project pages live under /<repo>/, override with DOCS_BASE for a custom domain
  base: process.env.DOCS_BASE ?? '/VortexAPI-Docs/',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['reference/sidebar.json'],
  head: [['meta', { name: 'theme-color', content: '#7c3aed' }]],
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Reference', link: '/reference/services/' },
      { text: 'Tools', items: [
        { text: 'VortexStudio-MCP', link: 'https://github.com/xRookieFight/VortexStudio-MCP' },
        { text: 'VortexLinux', link: 'https://github.com/xRookieFight/VortexLinux' },
      ] },
    ],
    sidebar: {
      '/guide/': [
        { text: 'Guide', items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Scripts and where they run', link: '/guide/scripts' },
          { text: 'Talking between server and client', link: '/guide/networking' },
          { text: 'Coming from Roblox', link: '/guide/coming-from-roblox' },
          { text: 'Limits', link: '/guide/limits' },
        ] },
      ],
      '/reference/': referenceSidebar,
    },
    search: { provider: 'local' },
    outline: { level: [2, 3] },
    socialLinks: [{ icon: 'github', link: repo }],
    editLink: {
      // reference pages are generated, the real source is the api data file.
      // VitePress ships this function to the browser on its own, so it can't use `repo`
      pattern: ({ filePath }) =>
        filePath.startsWith('reference/')
          ? 'https://github.com/xRookieFight/VortexAPI-Docs/edit/main/data/api.json'
          : `https://github.com/xRookieFight/VortexAPI-Docs/edit/main/docs/${filePath}`,
      text: 'Suggest a change',
    },
    footer: {
      message: 'Unofficial community documentation, not affiliated with Vortex. Content under the MIT license.',
    },
  },
})
