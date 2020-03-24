// process.env.SUPPRESS_NO_CONFIG_WARNING = true
const MetaParser = require('./meta.js')
const scanner = require('./scanner.js')
const template = require('./_template.js')
const fileWriter = require('./file-writer.js')
const monitor = require('./monitor.js')
const path = require('path')
const createBundles = require('./createBundles')
const log = require('./log')
const config = require('config') || {}
const defaults = require('../../config.defaults.json')

// returnResult is for tests usage
const Builder = (
  options,
  returnResult = false,
  metaParser = MetaParser()
) => async () => {
  const tree = await scanner(options, metaParser)
  const fileContent = template(tree, options)

  if (returnResult) {
    return fileContent
  } else {
    createBundles(tree.dir, options) // run bundle creation async
    writeUrlIndex(tree, options)
    const file = options.routifyDir + '/routes.js'
    await fileWriter(fileContent, file)
    log('Generated routes')
  }
}

/**
 * flattenTree
 * @param {Object} tree
 * @param {Array} arr
 */
function flattenTree(tree, arr = []) {
  tree.forEach(file => {
    if (file.dir) arr.push(...flattenTree(file.dir))
    else arr.push(file)
  })
  return arr
}

function writeUrlIndex(tree, options) {
  const routes = flattenTree(tree.dir)
    .filter(({ isFallback, isLayout }) => !isFallback && !isLayout)
    .filter(({ path }) => !path.match(/\/\:/))
  const paths = routes.map(({ path }) => path)
  fileWriter(
    'module.exports = ' + JSON.stringify(paths, 0, 2),
    options.routifyDir + '/urlIndex.js'
  )
}

// NOTE we want to keep this method synchronous to easily expose its public
// API (i.e. the object it returns)
const start = function start(inputOptions) {
  const options = { ...defaults, ...config, ...inputOptions }
  options.pages = path.resolve(options.pages).replace(/\\/g, '/')

  fileWriter(JSON.stringify(options, 0, 2), options.routifyDir + '/config.json')
  fileWriter(
    'export default ' + JSON.stringify(options, 0, 2),
    options.routifyDir + '/config.js'
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
      close() {},
    }
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
