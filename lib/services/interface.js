// process.env.SUPPRESS_NO_CONFIG_WARNING = true
const MetaParser = require('./metaParser.js')
const runMiddleware = require('./middlewareRunner.js')
const fileWriter = require('./file-writer.js')
const monitor = require('./monitor.js')
const path = require('path')
const createBundles = require('./createBundles')
const log = require('../utils/log')
const { getConfig, normalizeConfig } = require('./config')

// NOTE we want to keep this method synchronous to easily expose its public
// API (i.e. the object it returns)
const start = function start(inputOptions) {
  const options = normalizeOptions({ ...getConfig(), ...inputOptions })

  fileWriter(
    `module.exports = ${JSON.stringify(options, null, 2)}`,
    `${options.routifyDir}/config.js`
  )

  const isWatch = !options.singleBuild

  const metaParser = MetaParser({ cache: isWatch })

  const build = Builder(options, false, metaParser)
  const buildPromise = build()

  const watch = isWatch && monitor(options, metaParser, build)

  if (watch) {
    if (options.childProcess) runChildProcess(options.childProcess)
    return {
      // wait change is intented to mitigate a nasty race between Routify and
      // rollup-plugin-hot/autocreate plugin (see Rollup plugin source for details)
      waitChange: async () => watch.waitChange(),

      // used by plugins (e.g. Rollup) to block the build until routes are
      // really ready
      waitIdle: async () => Promise.all([buildPromise, watch.waitIdle()]),

      // allows to cleanly closes test runner
      close: () => watch.close(),
    }
  } else {
    const resolved = Promise.resolve()
    return {
      waitChange: () => resolved,
      waitIdle: async () => await buildPromise,
      close() { },
    }
  }
}

// returnResult is for tests usage
function Builder(
  options,
  returnResult = false,
  metaParser = MetaParser({ cache: true })
) {
  return async function () {
    const payload = await runMiddleware({ options, metaParser })
    const { tree, template } = payload

    if (returnResult) {
      return template
    } else {
      // Let's write some files
      createBundles(tree.children, options) // run bundle creation async
      writeUrlIndex(tree, options)
      const file = options.routifyDir + '/routes.js'
      const delay = options.childProcess || options.singleBuild ? 0 : 2000
      await fileWriter(template, file)
      // we write twice to trigger bundlers (Rollup ಠ_ಠ) who don't pick up on changes within a certain timeframe
      if (delay)
        setTimeout(async () => {
          await fileWriter(template, file)
        }, delay)
      log('Generated routes')
    }
  }
}


function writeUrlIndex(tree, options) {
  const routes = flattenTree(tree.children)
    .filter(({ isFallback, isLayout }) => !isFallback && !isLayout)
    .filter(({ path }) => !path.match(/\/\:/))
  const paths = routes.map(({ path }) => path)
  fileWriter(
    'module.exports = ' + JSON.stringify(paths, null, 2),
    options.routifyDir + '/urlIndex.js'
  )


  /**
   * flattenTree
   * @param {Object} tree
   * @param {Array} arr
   */
  function flattenTree(tree, arr = []) {
    tree.forEach(file => {
      if (file.children) arr.push(...flattenTree(file.children))
      else arr.push(file)
    })
    return arr
  }
}

function runChildProcess(name) {
  require('child_process').spawn('npm', ['run', name], {
    cwd: process.cwd(),
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true,
  })
}

module.exports = {
  Builder, // for tests
  start,
}



function normalizeOptions(options) {
  const { extensions, pages } = options
  return {
    ...options,
    extensions: Array.isArray(extensions) ? extensions : extensions.split(','),
    pages: path.resolve(pages).replace(/\\/g, '/'),
    started: new Date().toISOString()
  }
}