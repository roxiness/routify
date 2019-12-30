import * as path from 'path'

const testDir = 'test/e2e'

export default {
  files: `./${testDir}/**/*.spec.js`,

  app: './example',

  // if the pages folder gets deleted, then our file watcher (for pages regen)
  // will stop working
  resetGlob: ['*', '!pages', 'pages/*'],

  fixturesDir: path.resolve(`./${testDir}/fixtures`),

  // use FS (instead of RAM mock, that doesn't work currently with Routify)
  fs: true,

  // Puppeteer's Chromium's user data dir -- useful to remember settings,
  // position, etc. of test browser (NOTE comment out & commit if not working
  // in Windows -- I'll add some support for local ignored config one day)
  userDataDir: '~/.svhs-pptr',
}
