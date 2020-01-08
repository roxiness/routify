// const { serializeRoute } = require('../utils')
const path = require('path')

module.exports = function template(routes, options) {
  const { pages, dynamicImports, unknownPropWarnings } = options
  const imports = dynamicImports ? [] : routes

  const lines = imports.map(
    route =>
      `import ${route.component} from '${pages.replace(/\\/g, '/') +
        route.filepath}'`
  )

  routes = routes.map(resolveComponent.bind(options))

  lines.push(
    `\n\n import { buildRoutes } from "${path
      .resolve(__dirname, '../../runtime/buildRoutes')
      .replace(/\\/g, '/')}"`,
    `\n\n const layouts = {`,
    routes
      .filter(r => r.isLayout)
      .map(({ path, component }) => {
        const dir = path.replace(/[^\/]+$/, '')

        return (
          `["${path}"]:` +
          escapeStuff(JSON.stringify({ component, path: dir }, 0, 2))
        )
      })
  )
  lines.push('}')

  routes = routes
    .filter(r => !r.isLayout) //layouts don't have names
    .map(({ layouts, ...route }) => ({
      ...route,
      layouts: layouts.map(n => `'''layouts['${n.path}']'''`),
    }))

  // guard: empty routes
  if (routes.length < 1) {
    return `
        export const routeKeys = []
        export const routes = []
      `
  }

  routes = routes.map(
    keepKeys([
      'isFallback',
      'isIndex',
      'hasParam',
      'path',
      'component',
      'layouts',
    ])
  )

  const routeKeys = Object.keys(routes.find(r => !r.isLayout))
  lines.push(
    `\n\n export const routeKeys = ${JSON.stringify(routeKeys)}`,
    `\n\n const _routes = [`,
    routes
      // .map(r => serializeRoute(r, routeKeys))
      .map(f => escapeStuff(JSON.stringify(f, 0, 2)))
      .join(`,\n`),
    ']',
    `\n\n export const routes = buildRoutes(_routes, routeKeys)`
  )

  const content = lines.join('\n')

  return `
    ${content}

    export const options = ${JSON.stringify({ unknownPropWarnings })}
    `
}

function escapeStuff(str) {
  return str.replace(/"'''|'''"/g, '')
}

function resolveComponent({ component, filepath, options, ...route }) {
  const { bundleId } = options
  const { dynamicImports, pages, outputDir } = this
  if (dynamicImports) {
    if (bundleId)
      component = `'''() => import('${outputDir}/${bundleId}').then(m => m.${component})'''`
    else
      component = `'''() => import('${pages}${filepath}').then(m => m.default)'''`
  } else component = `'''() => ${component}'''`
  return { component, filepath, options, ...route }
}

function keepKeys(keys) {
  return function(obj) {
    Object.keys(obj).forEach(key => {
      if (!keys.includes(key)) delete obj[key]
    })
    return obj
  }
}
