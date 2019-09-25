const path = require('path')
const fs = require('fs')
const filesToRoutes = require('./files-to-routes')
module.exports = function fileRouter(options = {}) {
    options.appFile = path.resolve(options.appFile || './src/App.svelte')
    options.pages = path.resolve(options.pages || './src/pages')

    return {
        name: 'file-router',
        async buildStart() {
            if (await !fs.existsSync(options.appFile))
                throw new Error('appFile could not be found. Default location: src/App.svelte - create the file or specify its location in options {appFile: path/to/appFile}')

            if (await !fs.existsSync(options.pages))
                throw new Error('pages could not be found. Default location: src/pages - create the dir or specify its location in options {pages: path/to/pages}')
        },
        async transform(code, id) {
            // console.log()
            if (id === options.appFile) {
                const patch = await filesToRoutes(options.pages)

                // enhance the Router tag in App.svelte to include 'routes={__routes}'
                code = code.replace(/(< *Router)([^\w])/, '$1 routes={__routes} $2')

                // Insert generated routes into App.svelte
                code = code.replace(/(< *script[^<>]*>)/, '$1\n/*added by file-router*/\n' + patch + '\n/*added by file-router*/')

                return code
            }
        }
    }
}