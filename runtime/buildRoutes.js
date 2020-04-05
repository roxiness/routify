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
    if (file.isFile) arr.push(file)
    if (file.children) arr.push(...flattenTree(file.children))
  })
  return arr
}

export function buildClientTree(file, parent = false, prevFiles = []) {

  const _prevFiles = []
  if (file.dir) {
    file.children = file.dir
      .sort((a, b) => a.meta.index - b.meta.index)
      .map(_file => {
        if (_file.isLayout) file.layout = _file
        const builtFile = buildClientTree({..._file}, file, [..._prevFiles])
        _prevFiles.push(builtFile)
        return builtFile
      })
    delete file.dir
  }

  const order = [
    "setIsIndexable",
    "assignRelations",
    "assignIndex",
    "assignLayout",
    "assignIndexables",
    "setPrototype",
  ]

  // eslint-disable-next-line import/namespace
  order.forEach(plugin => plugins[plugin]({ file, parent, prevFiles }));

  return file
}
