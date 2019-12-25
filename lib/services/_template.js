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
    `\n\n export const routes = [`,
    routes
      .filter(r => r.name) //layouts don't have names
      .map(({ filepath, component, layouts, ...route }) => ({
        ...route,
        component: dynamicImports
          ? `'''() => import('${pages}${filepath}').then(m => m.default)'''`
          : `'''() => ${component}'''`,
        layouts: layouts.map(n => ({
          path: n.path,
          url: n.path.replace(/\[([^\]]+)\]/, ':$1'),
          filepath: n.filepath,
          component: dynamicImports
            ?
            `'''() => import('${pages}${n.filepath}').then(m => m.default)'''`
            :
            `'''() => ${n.component}'''`,
        })),
      }))
      .map(f => escapeStuff(JSON.stringify(f, 0, 2)))
      .join(`,\n`),
    ']'
  )

  routes.forEach(route => delete route.filepath)
  routes.forEach(route => delete route.isLayout)

  const content = lines.join('\n')

  return `
    ${content}

    export const options = ${JSON.stringify({ unknownPropWarnings })}
    `
}

function escapeStuff(str) {
  return str.replace(/"'''|'''"/g, '')
}
