const path = require('path')
const CheapWatch = require('cheap-watch')

const fsa = require('./utils/fsa')
const filesToRoutes = require('./files-to-routes')

const ROUTES_FILE = 'generatedRoutes.js'

// TODO logs
const logPrefix = '[svelte-filerouter]'
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

  const regenerate = () =>
    generate().catch(err => {
      log.error('Failed to generate route files', err)
    })

  const ifNew = fn => ({ isNew }) => fn()

  watch.on('+', ifNew(regenerate))

  watch.on('-', regenerate)

  watch.init().catch(err => {
    log.error('Failed to watch pages directory', err)
  })

  regenerate()

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
    return (await id) === ROUTES_FILE ? renderGeneratedRoutes(options) : null
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

module.exports = function fileRouter(inputOptions) {
  const options = Object.assign({}, defaultOptions, inputOptions)

  if (options.watch) {
    options.watch = Object.assign({}, defaultOptions.watch, options.watch)
  }

  options.pages = path.resolve(options.pages)

  const hooks = options.watch ? withWatch(options) : withoutWatch(options)

  return Object.assign(
    {
      name: 'file-router',
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
