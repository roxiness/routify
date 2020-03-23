import { pathToParams, pathToRank, pathToRegex } from './utils'
import { isActive } from './helpers'

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
      if (file.isLayout) {
        file.param = {}
        layouts.push(file)
      }
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


export function createRelationalTree(tree, parent = false, prevFile = false) {
  let _prevFile = false
  if (tree.dir) {
    Object.setPrototypeOf(tree, Dir.prototype)
    tree.dir = tree.dir.sort((a, b) => a.meta.$index - b.meta.$index).map(file => {
      const _file = createRelationalTree(file, tree, _prevFile)
      if (isIndexable(_file)) _prevFile = _file
      return _file
    })
  }
  const Prototype = !parent ? Root
    : tree.dir ? Dir
      : tree.isReset ? Reset
        : tree.isLayout ? Layout
          : tree.isFallback ? Fallback
            : Page
  Object.setPrototypeOf(tree, Prototype.prototype)

  if (prevFile && isIndexable(tree)) {
    Object.defineProperty(tree, 'prevSibling', { get: () => prevFile });
    Object.defineProperty(prevFile, 'nextSibling', { get: () => tree });
  }
  if (parent) Object.defineProperty(tree, 'parent', { get: () => parent });

  let isActive
  Object.defineProperty(tree, 'isActive', { get: () => tree.ctx.isActive })

  if (tree.isIndex) Object.defineProperty(parent, 'index', { get: () => tree })
  if (tree.isLayout) Object.defineProperty(parent, 'layout', { get: () => tree })

  return tree
}

function isIndexable(file) {
  const { isLayout, isFallback, meta } = file
  return !isLayout && !isFallback && meta.$index !== false
}


function Layout() { }
function Dir() { }
function Fallback() { }
function Page() { }
function Reset() { }
function Root() { }