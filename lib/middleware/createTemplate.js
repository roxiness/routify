// const { serializeRoute } = require('../utils')
const { name, version } = require('../../package.json')

module.exports = template

/** @param {TreePayload} payload */
function template(payload) {
  const { tree, options } = payload
  const { dynamicImports } = options

  function importTemplate() {
    // const imports = routes.filter(route => !dynamicImports || route.meta.preload)
    return getImports(tree.children).map(
      route => `import ${route.id} from '${route.importPath}'`
    ).join(`\n`)
  }

  function getImports(children, imports = []) {
    children.forEach(file => {
      if (file.children)
        getImports(file.children, imports)
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
  payload.template = `
/**
 * ${name} ${version}
 * File generated ${new Date}
 */

export const __version = "${version}"
export const __timestamp = "${(new Date).toISOString()}"

//buildRoutes
import { buildClientTree } from "@sveltech/routify/runtime/buildRoutes"

//imports
${importTemplate()}

//options
export const options = ${JSON.stringify({})}

//tree
export const _tree = ${escapeStuff(JSON.stringify({ ...tree, children: stripKeys(tree.children, options) }, null, 2))}


export const {tree, routes} = buildClientTree(_tree)

`
}

/**
 * 
 * @param {TreePayload} tree 
 * @param {BuildConfig} options 
 */
function stripKeys(tree, options) {
  if (options && !options.singleBuild)
    return tree

  const keys = ['file', 'filepath', 'name', 'badExt', 'relativeDir', 'absolutePath', 'importPath']
  return tree.map(file => {
    const newObj = {}
    Object.keys(file).forEach(key => {
      if (!keys.includes(key))
        newObj[key] = file[key]
    })
    if (file.children)
      newObj.children = stripKeys(file.children)
    return newObj
  })
}
