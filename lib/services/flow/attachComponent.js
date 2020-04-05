const path = require('path')
const { walkAsync } = require('../../utils/fp')

async function attachComponent(payload) {
    const { dynamicImports, pages, routifyDir } = payload.options

    await walkAsync(async file => {
        if (file.isFile) {
            const { $$bundleId } = file.meta
            let component
            if (dynamicImports && !file.meta.preload) {
                if ($$bundleId) {
                    component = `'''() => import('${process.cwd() +
                        '/'}${routifyDir}/${$$bundleId}').then(m => m.${file.id})'''`
                } else {
                    component = `'''() => import('${pages}${file.filepath}').then(m => m.default)'''`
                }
            } else {
                component = `'''() => ${file.id}'''`
            }
            file.component = component
        }
        if (file.isLayout) {
            file.path = path.posix.dirname(file.path)
        }
        return file
    })(payload.tree)

}

module.exports = { attachComponent }