const scanner = require('./scanner.js')
const compiler = require('./compiler.js')
const template = require('./_template.js')
const fileWriter = require('./file-writer.js')
const monitor = require('./monitor.js')
const { sanitizeOptions } = require('../utils')
const path = require('path')
const createBundles = require('./createBundles')
const log = require('./log')

const defaultOptions = {
  pages: './src/pages',
  ignore: [],
  unknownPropWarnings: true,
  dynamicImports: false,
  singleBuild: false,
  outputDir: path.resolve(__dirname + '/../../tmp/').replace(/\\/g, '/'),
  scroll: false,
  extensions: ['html', 'svelte']
}

// returnResult is for tests usage
const Builder = (options, returnResult = false) => async () => {
  const files = await scanner(options)
  const routeData = await compiler(files)
  createBundles(routeData, options) // run bundle creation async
  writeUrlIndex(routeData)
  const fileContent = template(routeData, options)

  if (returnResult) {
    return fileContent
  } else {
    const file = options.outputFile || options.outputDir + '/routes.js' //deprecate outputdir?
    await fileWriter(fileContent, file)
    log('Generated routes')
  }
}

function writeUrlIndex(routeData) {
  const routes = routeData
    .filter(({ isFallback, isLayout }) => !isFallback && !isLayout)
    .filter(({ path }) => !path.match(/\/\:/))
  const paths = routes.map(({ path }) => path)
  fileWriter('module.exports = ' + JSON.stringify(paths, 0, 2), __dirname + '/../../tmp/urlIndex.js')
}


// NOTE we want to keep this method synchronous to easily expose its public
// API (i.e. the object it returns)
const start = function start(inputOptions) {
  const options = sanitizeOptions(defaultOptions, inputOptions)
  options.pages = path.resolve(options.pages).replace(/\\/g, '/')


  fileWriter(JSON.stringify(options, 0, 2), __dirname + '/../../tmp/config.json')
  fileWriter('export default ' + JSON.stringify(options, 0, 2), __dirname + '/../../tmp/config.js')


  const build = Builder(options)

  const watch = !options.singleBuild && monitor(options, build)

  const buildPromise = build()
  if (watch)
    return {
      // used by plugins (e.g. Rollup) to block the build until routes are
      // really ready
      waitIdle: async () =>
        Promise.all([buildPromise, watch.waitIdle()]),

      // allows to cleanly closes test runner
      close: () => watch.close(),
    }
  else return {
    waitIdle: false,
    close() { }
  }
}

module.exports = {
  Builder, // for tests
  start,
  defaultOptions
}
