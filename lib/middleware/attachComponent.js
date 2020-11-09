const path = require('path')
const { realpathSync } = require('fs')
const { createNodeMiddleware } = require('../utils/middleware')

const attachComponent = createNodeMiddleware(({ state, file }) => {
    const { dynamicImports, pages, routifyDir } = state.treePayload.options

    if (file.isFile) {
        const { $$bundleId, preload } = file.meta

        if (dynamicImports && preload !== true) {
            if ($$bundleId) {
                file.component = `'''() => import('./${$$bundleId}').then(m => m.${file.id})'''`
            } else {
                file.component = `'''() => import('${file.importPath}').then(m => m.default)'''`
            }
        } else {
            file.component = `'''() => ${file.id}'''`
        }
    }
    if (file.isLayout) {
        file.path = path.posix.dirname(file.path)
    }
    return file
})

module.exports = { attachComponent }