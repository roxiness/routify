const path = require('path')
const CheapWatch = require('cheap-watch')
const temp = require('temp')

const fsa = require('./utils/fsa')
const filesToRoutes = require('./files-to-routes')

const ROUTES_FILE = 'generatedRoutes.js'

module.exports = function fileRouter(options = {}) {
    options = Object.assign({
        pages: './src/pages',
        ignore: [],
        unknownPropWarnings: true,
        dynamicImports: false,
    }, options)

    options.pages = path.resolve(options.pages)

    const hooks = {
        name: 'file-router',
        async buildStart() {
            if (await !fsa.exists(options.pages))
                throw new Error('pages could not be found. Default location: src/pages - create the dir or specify its location in options {pages: path/to/pages}')
        },
    }

    if (options.watch !== false) {
      console.log('watching...', options.pages)

      const {
        watch: {
          tmpFilename = async () => temp.path({ prefix: ROUTES_FILE, suffix: '.js' })
        } = true
      } = options

      const watch = new CheapWatch({ dir: options.pages })

      const filenamePromise = tmpFilename()

      let idlePromise

      const doGenerate = async () => {
        const filename = await filenamePromise
        const contents = await createGeneratedRoutes(options)
        await fsa.writeFile(filename, contents, 'utf8')
        console.log('written', filename)
      }

      const generate = async () => {
        await idlePromise
        idlePromise = doGenerate()
      }

      const regenerate = () => generate().catch(err => {
        console.error('Failed to generate route files', err && err.stack || err)
      })

      watch.on('+', ({ isNew }) => {
        if (isNew) { regenerate() }
      })

      watch.on('-', regenerate)

      watch.init().catch(err => {
        console.error('Failed to watch pages directory', err && err.stack || err)
      })

      regenerate()

      Object.assign(hooks, {
        async resolveId(id) {
          if (id === ROUTES_FILE) {
            await idlePromise
            return await filenamePromise
          }
          return null
        },
      })
    } else {
      Object.assign(hooks, {
        resolveId(id) {
           return id === ROUTES_FILE ? id : null
        },
        async load(id) {
           return await id === ROUTES_FILE ? createGeneratedRoutes(options) : null
        },
      })
    }

    return hooks
}

async function createGeneratedRoutes(options) {
    clientOptions = { unknownPropWarnings: options.unknownPropWarnings }
    let str = await filesToRoutes(options)
    str += `\n\n export const options = ${JSON.stringify(clientOptions)}`
    return str
}
