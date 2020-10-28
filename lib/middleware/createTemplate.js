const { stripDefaultsAndDevProps } = require("esm")(module)('../../runtime/utils/normalizeNode')

const { name, version } = require('../../package.json')

module.exports = template

/** @param {TreePayload} payload */
function template(payload) {
  const { tree, options } = payload
  const { dynamicImports, singleBuild } = options

  function importTemplate() {
    return getImports([tree]).map(
      route => `import ${route.id} from '${route.importPath}'`
    ).join(`\n`)
  }

  function getImports(children, imports = []) {
    children.forEach(file => {
      if (file.children)
        getImports(file.children, imports)
      if (file.isFile && (file.meta.preload === true || !dynamicImports))
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
import { buildClientTree } from "@roxi/routify/runtime/buildRoutes"

//imports
${importTemplate()}

//options
export const options = ${JSON.stringify({})}

//tree
export const _tree = ${escapeStuff(JSON.stringify(singleBuild ? stripDefaultsAndDevProps(tree) : tree, null, 2))}


export const {tree, routes} = buildClientTree(_tree)

`
}


