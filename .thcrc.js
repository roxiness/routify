import * as path from 'path'
import * as fs from 'fs'

const testDir = 'test/e2e'

// ensures that we always use svelte from example/node_modules
const resolveSvelte = ({ appPath }) => {
  if (appPath) {
    const possibleLocations = [
      () => path.resolve(fs.realpathSync(appPath), 'node_modules', 'svelte'),
      () =>
        path.resolve(
          fs.realpathSync(__dirname),
          '..',
          'node_modules',
          'svelte'
        ),
    ]
    const found = possibleLocations.some(getPath => {
      try {
        const sveltePath = getPath()
        if (fs.existsSync(sveltePath)) {
          const { version } = require(path.join(sveltePath, 'package.json'))
          process.env.SVELTE = sveltePath
          // eslint-disable-next-line no-console
          console.log(`[.thcrc] Use Svelte v${version}: ${sveltePath}`)
          return true
        }
      } catch (err) {
        if (err.code !== 'ENOENT') {
          throw err
        }
      }
    })
    if (!found) {
      const call = fn => fn()
      // eslint-disable-next-line no-console
      console.warn(
        'Failed to find Svelte install. Tried locations:\n' +
          possibleLocations
            .map(call)
            .map(loc => '- ' + loc)
            .join('\n')
      )
    }
  }
}

export default {
  files: `./${testDir}/**/*.spec.js`,

  bootstrap: resolveSvelte,

  app: 'example',

  // if the pages folder gets deleted, then our file watcher (for pages regen)
  // will stop working
  resetGlob: ['*', '!pages', 'pages/*'],

  fixturesDir: path.resolve(__dirname, testDir, 'fixtures'),

  // use FS (instead of RAM mock, that doesn't work currently with Routify)
  fs: true,

  // Puppeteer's Chromium's user data dir -- useful to remember settings,
  // position, etc. of test browser (NOTE comment out & commit if not working
  // in Windows -- I'll add some support for local ignored config one day)
  userDataDir: '~/.svhs-pptr',
}
