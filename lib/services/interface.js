const scanner = require('./scanner.js')
const compiler = require('./compiler.js')
const template = require('./_template.js')
const fileWriter = require('./file-writer.js')
const monitor = require('./monitor.js')
const { sanitizeOptions } = require('../utils')
const path = require('path')
const createBundles = require('./createBundles')

const defaultOptions = {
  pages: './src/pages',
  ignore: [],
  unknownPropWarnings: true,
  dynamicImports: false,
  singleBuild: false,
  outputDir: path
    .resolve(__dirname + '/../../tmp/')
    .replace(/\\/g, '/'),
  watch: true,
}

// returnResult is for tests usage
const Builder = (options, returnResult = false) => async () => {
  const files = await scanner(options)
  const routeData = await compiler(files)
  createBundles(routeData, options) // run bundle creation async
  const fileContent = template(routeData, options)
  if (returnResult) {
    return fileContent
  } else {
    const file = options.outputFile || options.outputDir + '/routes.js' //deprecate outputdir?
    await fileWriter(fileContent, file)
  }
}

// NOTE we want to keep this method synchronous to easily expose its public
// API (i.e. the object it returns)
const start = function start(inputOptions) {
  const options = sanitizeOptions(defaultOptions, inputOptions)
  options.pages = path.resolve(options.pages).replace(/\\/g, '/')

  const build = Builder(options)

  const watch = options.watch && monitor(options, build)

  const buildPromise = build()

  return {
    // used by plugins (e.g. Rollup) to block the build until routes are
    // really ready
    waitIdle: async () =>
      Promise.all([buildPromise, watch && watch.waitIdle()]),

    // allows to cleanly closes test runner
    close: () => watch && watch.close(),
  }
}

module.exports = {
  Builder, // for tests
  start,
}
