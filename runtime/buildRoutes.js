import { pathToParams, pathToRank, pathToRegex } from './utils'

export function buildRoutes(tree) {
  const treeWithLayouts = applyLayouts(tree)
  const routes = flattenTree(treeWithLayouts)
  return (
    routes
      .filter(route => !route.isLayout)
      .map(decorateRoute)
      .sort((c, p) => (c.ranking >= p.ranking ? -1 : 1))
  )
}

const decorateRoute = function (route) {
  route.paramKeys = pathToParams(route.path)
  route.regex = pathToRegex(route.path, route.isFallback)
  route.name = route.path.match(/[^\/]*\/[^\/]+$/)[0].replace(/[^\w\/]/g, '') //last dir and name, then replace all but \w and /
  route.shortPath = route.path.replace(/\/(index|_fallback)$/, '')
  route.ranking = pathToRank(route)
  route.layouts.map(l => {
    l.param = {}
    return l
  })
  route.params = {}

  return route
}

/**
 * applyLayouts
 * @param {Object} tree
 * @param {Array} layouts
 */
function applyLayouts(tree, layouts = []) {
  return tree.map(file => {
    if (file.dir) {
      file.dir = applyLayouts(file.dir, [...layouts])
    } else {
      if (file.isReset || file.meta.$reset) layouts = []
      if (file.isLayout) layouts.push(file)
      else file.layouts = layouts
    }
    return file
  })
}

/**
 * flattenTree
 * @param {Object} tree
 * @param {Array} arr
 */
function flattenTree(tree, arr = []) {
  tree.forEach(file => {
    if (file.dir)
      arr.push(...flattenTree(file.dir))
    else
      arr.push(file)
  })
  return arr
}
