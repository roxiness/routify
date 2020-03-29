// const { serializeRoute } = require('../utils')
const path = require('path')
const { name, version } = require('../../package.json')

module.exports = function template(routes, options) {
  const { pages, dynamicImports, unknownPropWarnings } = options
  const importFiles = dynamicImports ? [] : routes
  const { stringify } = JSON
  const keys = ['isFallback',
    'isIndex',
    'hasParam',
    'path',
    'component',
    'layouts',
    'meta',
    'shortPath']

  const buildRoutesPath = path.resolve(__dirname, '../../runtime/buildRoutes').replace(/\\/g, '/')

  routes = routes.map(resolveComponent.bind(options))

  const layouts = {}
  routes.filter(r => r.isLayout)
    .map(keepKeys(['path', 'component', 'meta', 'relativeDir']))
    .map(l => ({ ...l }))
    .forEach(layout => { layouts[layout.path] = { ...layout, path: layout.path.replace(/\/[^/]+$/, '') } })
  const layoutsTemplate = escapeStuff(stringify(layouts, 0, 2))


  const importTemplate = importFiles.map(
    route =>
      `import ${route.component} from '${pages.replace(/\\/g, '/') +
      route.filepath}'`
  ).join(`\n`)


  routes = routes
    .filter(r => !r.isLayout)
    .map(keepKeys(keys))
    .map(({ layouts, ...route }) => ({
      ...route,
      layouts: layouts.map(n => `'''layouts['${n.path}']'''`),
    }))

  const routesTemplate = escapeStuff(stringify(routes, 0, 2))



  function escapeStuff(str) {
    return str.replace(/"'''|'''"/g, '')
  }

  function resolveComponent({ component, filepath, meta, ...route }) {
    const { $$bundleId } = meta
    const { dynamicImports, pages, outputDir } = this
    if (dynamicImports) {
      if ($$bundleId)
        component = `'''() => import('${outputDir}/${$$bundleId}').then(m => m.${component})'''`
      else
        component = `'''() => import('${pages}${filepath}').then(m => m.default)'''`
    } else component = `'''() => ${component}'''`
    return { component, filepath, meta, ...route }
  }

  function keepKeys(keys) {
    return function (obj) {
      const newObj = {}
      Object.entries(obj).forEach(([key, value]) => {
        if (keys.includes(key)) newObj[key] = value
      })
      return newObj
    }
  }



  /**
   * TEMPLATE
   */
  return `
/**
 * ${name} ${version}
 * File generated ${new Date}
 */

//buildRoutes
import { buildRoutes } from "${buildRoutesPath}"

//imports
${importTemplate}

//keys
const keys = ${stringify(keys)}

//layouts
const layouts = ${layoutsTemplate}


//raw routes
const _routes = ${routesTemplate}

//options
export const options = ${JSON.stringify({ unknownPropWarnings })}

//routes
export const routes = buildRoutes(_routes, keys)
`

}
