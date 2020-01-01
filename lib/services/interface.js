const scanner = require('./scanner.js')
const compiler = require('./compiler.js')
const template = require('./_template.js')
const fileWriter = require('./file-writer.js')
const monitor = require('./monitor.js')
const { sanitizeOptions } = require('../utils')
const path = require('path')

const defaultOptions = {
  pages: './src/pages',
  ignore: [],
  unknownPropWarnings: true,
  dynamicImports: false,
  singleBuild: false,
  outputFile: path
    .resolve(__dirname + '/../../tmp/routes.js')
    .replace(/\\/g, '/'),
  watch: true,
}

export const Builder = options => async (returnResult = false) => {
  const analysis = await scanner(options)
  const routeData = await compiler(analysis)
  const fileContent = template(routeData, options)
  if (returnResult) {
    return fileContent
  } else {
    await fileWriter(fileContent, options)
  }
}

// NOTE we want to keep this method synchronous to easily expose its public
// API (i.e. the object it returns)
module.exports.start = function start(inputOptions) {
  const options = sanitizeOptions(defaultOptions, inputOptions)
  options.pages = path.resolve(options.pages)

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
