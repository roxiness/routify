import { pathToParams, pathToRank, pathToRegex } from './utils'
import { isActive } from './helpers'
import * as plugins from './plugins/tree'

export function buildRoutes(tree) {
  // const treeWithLayouts = applyLayouts(tree)
  const routes = flattenTree(tree)
  return routes
    .filter(route => !route.isLayout)
    .map(decorateRoute)
    .sort((c, p) => (c.ranking >= p.ranking ? -1 : 1))
}

const decorateRoute = function (route) {
  route.paramKeys = pathToParams(route.path)
  route.regex = pathToRegex(route.path, route.isFallback)
  route.name = route.path.match(/[^\/]*\/[^\/]+$/)[0].replace(/[^\w\/]/g, '') //last dir and name, then replace all but \w and /
  route.shortPath = route.path.replace(/\/(index|_fallback)$/, '')
  route.ranking = pathToRank(route)
  route.params = {}

  return route
}

/**
 * flattenTree
 * @param {Object} tree
 * @param {Array} arr
 */
function flattenTree(tree, arr = []) {
  tree.forEach(file => {
    if (file.children) arr.push(...flattenTree(file.children))
    else arr.push(file)
  })
  return arr
}

export function buildClientTree(_tree, parent = false, prevFiles = []) {
  const tree = { ..._tree }
  const _prevFiles = []
  if (tree.dir) {

    tree.children = tree.dir
      .sort((a, b) => a.meta.index - b.meta.index)
      .map(file => {
        if (file.isLayout) tree.layout = file
        const _file = buildClientTree(file, tree, [..._prevFiles])
        _prevFiles.push(_file)
        return _file
      })
    delete tree.dir
  }

  const order = [
    "setIsIndexable",
    "assignRelations",
    "assignIndex",
    "assignLayout",
    "assignIndexables",
    "setPrototype",
  ]

  order.forEach(plugin => plugins[plugin]({ tree, parent, prevFiles }));

  return tree
}