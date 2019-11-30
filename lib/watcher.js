const path = require('path')
const CheapWatch = require('cheap-watch')
const fsa = require('./utils/fsa')
const filesToRoutes = require('./files-to-routes')
const { name: NAME } = require('../package.json')

// this one should probably use { createFilter } from 'rollup-pluginutils'
const watchWhiteList = /^_(?:layout|reset|fallback)\./
// TODO this should be centralized (utils / config)
const extensions = ['.svelte', '.html']


// TODO logs
const logPrefix = `[${NAME}]`
const log = console.log.bind(console, logPrefix)
log.debug = () => { }
log.error = console.error.bind(console, logPrefix)


module.exports.generateRoutes = async function (inputOptions) {
    const defaultOptions = {
        pages: './src/pages',
        ignore: [],
        unknownPropWarnings: true,
        dynamicImports: false,
        watch: true,
        outputFile: path.resolve(__dirname + '/../dist/routes.js').replace(/\\/g, '/'),
    }
    let options = defaultOptions
    Object.entries(inputOptions).forEach(([key, value])=>{
        if(typeof options[key] !== 'undefined'){
            options[key] = value
        }
    })
    options.pages = path.resolve(options.pages)

    if (await !fsa.exists(options.pages)) {
        throw new Error(
            'pages could not be found. Default location: src/pages - create the dir or specify its location in options {pages: path/to/pages}'
        )
    }

    return options.watch ? withWatch(options) : withoutWatch(options)
}



const renderGeneratedRoutes = async ({
    unknownPropWarnings,
    pages,
    ignore,
    dynamicImports,
    outputFile
}) => `
    ${await filesToRoutes({ pages, ignore, dynamicImports, outputFile })}
  
    export const options = ${JSON.stringify({ unknownPropWarnings })}
  `

const resolveOutputFile = async input => {
    const value = typeof input === 'function' ? await input() : input
    return path.resolve(value)
}

const withoutWatch = options => { renderGeneratedRoutes(options) }


const withWatch = options => {
    const {
        pages: dir,
        outputFile,
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
}

