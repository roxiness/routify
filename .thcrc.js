module.exports = {
  files: './test/**/*.spec.js',

  app: './example',

  // if the pages folder gets deleted, then our file watcher (for pages regen)
  // will stop working
  resetGlob: ['*', '!pages', 'pages/*'],

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
        import { routes } from './.tmp/routes.js'
      </script>

      console.log('routes', routes)

      <Router {routes} />
    `,
  },

  // use FS (instead of RAM mock, that doesn't work currently with Routify)
  fs: true,

  // Puppeteer's Chromium's user data dir -- useful to remember settings,
  // position, etc. of test browser (NOTE comment out & commit if not working
  // in Windows -- I'll add some support for local ignored config one day)
  userDataDir: '~/.svhs-pptr',
}
