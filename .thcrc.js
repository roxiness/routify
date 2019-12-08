module.exports = {
  files: './test/**/*.spec.js',
  app: './example',
  fixtures: {
    'main.js': `
      import App from './App.svelte'

      const target = document.body
      const app = new App({ target })

      export default app

      if (import.meta.hot) {
        import.meta.hot.dispose(() => { app.$destroy() })
        import.meta.hot.accept()
      }
    `,
    'App.svelte': `
      <script>
        import { Router } from '@sveltech/routify'
        import { routes } from '@sveltech/routify/tmp/routes'
      </script>

      <Router {routes} />
    `,
  },
  // use FS (instead of RAM mock, but that doesn't work currently with Routify)
  fs: true,
  // Puppeteer's Chromium's user data dir -- useful to remember settings,
  // position, etc. of test browser
  userDataDir: '~/.svhs-pptr',
}
