const path = require('path')
const CheapWatch = require('cheap-watch')
const fsa = require('./utils/fsa')
const renderTemplate = require('./template')
const { name: NAME } = require('../package.json')

// this one should probably use { createFilter } from 'rollup-pluginutils'
const watchWhiteList = /^_(?:layout|reset|fallback)\./
// TODO this should be centralized (utils / config)
const extensions = ['.svelte', '.html']

const defaultOptions = {
    pages: './src/pages',
    ignore: [],
    unknownPropWarnings: true,
    dynamicImports: false,
    singleBuild: false,
    outputFile: path.resolve(__dirname + '/../router.svelte').replace(/\\/g, '/'),
}


// TODO logs
const logPrefix = `[${NAME}]`
const log = console.log.bind(console, logPrefix)
log.debug = () => { }
log.error = console.error.bind(console, logPrefix)


const resolveOutputFile = async input => {
    const value = typeof input === 'function' ? await input() : input
    return path.resolve(value)
}

const generator = options => {
    const { outputFile } = options

    const filenamePromise = resolveOutputFile(outputFile)

    const generate = async event => {
        if (event) {
          log(`Generate routes (changed: ${event.path})`)
        } else {
          log('Generate routes')
        }
        const filename = await filenamePromise
        await fsa.mkdir(path.dirname(filename), { recursive: true })
        const contents = await renderTemplate(options)
        await fsa.writeFile(filename, contents, 'utf8')
        log.debug('Written', filename)
    }

    return generate
}

const singleBuild = async options => {
  const generate = generator(options)

  await generate().catch(err => {
      log.error('Failed to generate route files', err)
  })
}

// must resolve when the initial routes have been generated (aka system ready)
const buildWatch = async options => {
    const {
        pages: dir,
        outputFile,
    } = options

    log('Watching', dir)

    const watch = new CheapWatch({ dir })

    let idlePromise

    const doGenerate = generator(options)

    const generate = async event => {
        await idlePromise
        idlePromise = doGenerate(event)
        return idlePromise
    }

    const safeGenerate = event =>
        generate(event).catch(err => {
            log.error('Failed to generate route files', err)
        })

    const ifIsRoute = fn => event => {
        const { path: p, stats } = event
        if (stats.isDirectory()) return
        if (!extensions.includes(path.extname(p))) return
        const basename = path.basename(p)
        const priv = basename.substr(0, 1) === '_'
        if (priv && !watchWhiteList.test(basename)) return
        return fn(event)
    }

    const maybeRegenerate = ifIsRoute(safeGenerate)

    const ifIsNew = fn => x => x.isNew && fn(x)

    watch.on('+', ifIsNew(maybeRegenerate))

    watch.on('-', maybeRegenerate)

    watch.init().catch(err => {
        log.error('Failed to watch pages directory', err)
    })

    await safeGenerate()
}

async function generateRoutes (inputOptions) {
    const options = Object.assign({}, defaultOptions, inputOptions)

    options.pages = path.resolve(options.pages)

    if (await !fsa.exists(options.pages)) {
        throw new Error(
            'pages could not be found. Default location: src/pages - create the dir or specify its location in options {pages: path/to/pages}'
        )
    }

    if (options.singleBuild) {
      await singleBuild(options)
    } else {
      await buildWatch(options)
    }
}

// rixo: I'd argue this should remain last because, esthetically, the end is
// where you (well, I) would expect the result. Also, programmatically, jumping
// to the end is often easier than trying to locate where the actual code starts,
// because the top gets crowded with imports, constants, etc.
module.exports = {
  generateRoutes,
}
