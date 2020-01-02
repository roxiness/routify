// const { serializeRoute } = require('../utils')
const path = require('path')

module.exports = function template(
  routes,
  { pages, dynamicImports, unknownPropWarnings }
) {
  const imports = dynamicImports ? [] : routes

  const lines = imports.map(
    route =>
      `import ${route.component} from '${pages.replace(/\\/g, '/') +
      route.filepath}'`
  )

  lines.push(
    `\n\n import { buildRoutes } from "${path
      .resolve(__dirname, '../../runtime/buildRoutes')
      .replace(/\\/g, '/')}"`,
    `\n\n const layouts = {`,
    routes
      .filter(r => r.isLayout)
      .map(({ path, filepath, ...layout }) => {
        const dir = path.replace(/[^\/]+$/, '')
        const component = dynamicImports
          ? `'''() => import('${pages}${filepath}').then(m => m.default)'''`
          : `'''() => ${layout.component}'''`
        return (
          `["${path}"]:` +
          escapeStuff(JSON.stringify({ component, path: dir }, 0, 2))
        )
      })
  )
  lines.push('}')

  routes = routes
    .filter(r => !r.isLayout) //layouts don't have names
    .map(({ filepath, component, layouts, ...route }) => ({
      ...route,
      component: dynamicImports
        ? `'''() => import('${pages}${filepath}').then(m => m.default)'''`
        : `'''() => ${component}'''`,
      layouts: layouts.map(n => `'''layouts['${n.path}']'''`),
    }))

  // guard: empty routes
  if (routes.length < 1) {
    return `
        export const routeKeys = []
        export const routes = []
      `
  }

  routes.forEach(route => delete route.isLayout)
  routes.forEach(route => delete route.filepath)

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
