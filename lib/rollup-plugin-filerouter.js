const path = require('path')
const fs = require('fs')
const filesToRoutes = require('./files-to-routes')
const ROUTES_FILE = 'generatedRoutes.js'

module.exports = function fileRouter(options = {}) {
    options = Object.assign({
        appFile: './src/App.svelte',
        pages: './src/pages',
        ignore: [],
        unknownPropWarnings: true,
        dynamicImports: false
    }, options)


    return {
        name: 'file-router',
        async buildStart() {
            if (await !fs.existsSync(options.appFile))
                throw new Error('appFile could not be found. Default location: src/App.svelte - create the file or specify its location in options {appFile: path/to/appFile}')

            if (await !fs.existsSync(options.pages))
                throw new Error('pages could not be found. Default location: src/pages - create the dir or specify its location in options {pages: path/to/pages}')
        },

        resolveId(id) { return id === ROUTES_FILE ? id : null },

        async load(id) { return await id === ROUTES_FILE ? createGeneratedRoutes(options) : null }
    }
}

async function createGeneratedRoutes(options) {
    clientOptions = { unknownPropWarnings: options.unknownPropWarnings }
    let str = await filesToRoutes(options)
    str += `\n\n export const options = ${JSON.stringify(clientOptions)}`
    return str
}
