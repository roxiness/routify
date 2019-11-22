const path = require('path')
const CheapWatch = require('cheap-watch')

const fsa = require('./utils/fsa')
const filesToRoutes = require('./files-to-routes')
const { name: NAME } = require('../package.json')

const ROUTES_FILE = 'generatedRoutes.js'

// TODO this should be centralized (utils / config)
const extensions = ['.svelte', '.html']
// this one should probably use { createFilter } from 'rollup-pluginutils'
const watchWhiteList = /^_(?:layout|reset|fallback)\./

// TODO logs
const logPrefix = `[${NAME}]`
const log = console.log.bind(console, logPrefix)
log.debug = () => {}
log.error = console.error.bind(console, logPrefix)

const renderGeneratedRoutes = async ({
  unknownPropWarnings,
  pages,
  ignore,
  dynamicImports,
}) => `
  ${await filesToRoutes({ pages, ignore, dynamicImports })}

  export const options = ${JSON.stringify({ unknownPropWarnings })}
`

const resolveOutputFile = async input => {
  const value = typeof input === 'function' ? await input() : input
  return path.resolve(value)
}

const withWatch = options => {
  const {
    pages: dir,
    watch: { outputFile },
  } = options

  log('Watching', dir)

  const watch = new CheapWatch({ dir })

  const filenamePromise = resolveOutputFile(outputFile)

  let idlePromise

  const doGenerate = async () => {
    const filename = await filenamePromise
    await fsa.mkdir(path.dirname(filename), { recursive: true })
    const contents = await renderGeneratedRoutes(options)
    await fsa.writeFile(filename, contents, 'utf8')
    log.debug('Written', filename)
  }

  const generate = async () => {
    await idlePromise
    idlePromise = doGenerate()
  }

  const safeGenerate = () =>
    generate().catch(err => {
      log.error('Failed to generate route files', err)
    })

  const ifIsRoute = fn => x => {
    const { path: p, stats } = x
    if (stats.isDirectory()) return
    if (!extensions.includes(path.extname(p))) return
    const basename = path.basename(p)
    const priv = basename.substr(0, 1) === '_'
    if (priv && !watchWhiteList.test(basename)) return
    return fn(x)
  }

  const maybeRegenerate = ifIsRoute(safeGenerate)

  const ifIsNew = fn => x => x.isNew && fn(x)

  watch.on('+', ifIsNew(maybeRegenerate))

  watch.on('-', maybeRegenerate)

  watch.init().catch(err => {
    log.error('Failed to watch pages directory', err)
  })

  safeGenerate()

  return {
    async resolveId(id) {
      if (id === ROUTES_FILE) {
        await idlePromise
        return await filenamePromise
      }
      return null
    },
  }
}

const withoutWatch = options => ({
  resolveId(id) {
    return id === ROUTES_FILE ? id : null
  },
  async load(id) {
    return id === ROUTES_FILE ? renderGeneratedRoutes(options) : null
  },
})

const defaultOptions = {
  pages: './src/pages',
  ignore: [],
  unknownPropWarnings: true,
  dynamicImports: false,
  watch: {
    // Currently, to make Rollup pick the change, we have to hit the disk. So we
    // need a filename...
    //
    // Can be a string or a function (can be async).
    //
    // Best location is very project specific, so default is just to write it in
    // the root of the project, so that you see it and take appropriate action.
    // The best is probably somewhere under your system's `/tmp`, or your
    // project's dist folder.
    //
    outputFile: './svelte-filerouter-routes.js',
  },
}

module.exports = function svelteFileRouter(inputOptions) {
  const options = Object.assign({}, defaultOptions, inputOptions)

  if (options.watch) {
    options.watch = Object.assign({}, defaultOptions.watch, options.watch)
  }

  options.pages = path.resolve(options.pages)

  const hooks = options.watch ? withWatch(options) : withoutWatch(options)

  return Object.assign(
    {
      name: NAME,
      async buildStart() {
        if (await !fsa.exists(options.pages)) {
          throw new Error(
            'pages could not be found. Default location: src/pages - create the dir or specify its location in options {pages: path/to/pages}'
          )
        }
      },
    },
    hooks
  )
}
