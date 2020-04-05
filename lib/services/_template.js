// const { serializeRoute } = require('../utils')
const path = require('path')
const { name, version } = require('../../package.json')

module.exports = function template(tree, options) {
  const { dynamicImports } = options

  const buildRoutes_js = path.resolve(__dirname, '../../runtime/buildRoutes').replace(/\\/g, '/')

  function importTemplate() {
    // const imports = routes.filter(route => !dynamicImports || route.meta.preload)
    return getImports(tree.dir).map(
      route => `import ${route.id} from '${route.absolutePath}'`
    ).join(`\n`)
  }

  function getImports(dir, imports = []) {
    dir.forEach(file => {
      if (file.dir)
        getImports(file.dir, imports, false)
      if (file.isFile && (file.meta.preload || !dynamicImports))
        imports.push(file)
    })
    return imports
  }

  function escapeStuff(str) {
    return str.replace(/"'''|'''"/g, '')
  }

  /**
   * TEMPLATE
   */
  return `
/**
 * ${name} ${version}
 * File generated ${new Date}
 */

export const __version = "${version}"
export const __timestamp = "${(new Date).toISOString()}"

//buildRoutes
import { buildRoutes, buildClientTree } from "${buildRoutes_js}"

//imports
${importTemplate()}

//options
export const options = ${JSON.stringify({  })}

//tree
export const _tree = ${escapeStuff(JSON.stringify({ ...tree, dir: stripKeys(tree.dir) }, 0, 2))}

export const tree = buildClientTree(_tree)

//routes
export const routes = buildRoutes(tree.children)
`
}

function stripKeys(tree) {
  const keys = ['file', 'filepath', 'name', 'badExt', 'relativeDir', 'absolutePath']
  return tree.map(file => {
    const newObj = {}
    Object.keys(file).forEach(key => {
      if (!keys.includes(key))
        newObj[key] = file[key]
    })
    if (file.dir)
      newObj.dir = stripKeys(file.dir)
    return newObj
  })
}
