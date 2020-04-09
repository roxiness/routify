
import { createNodeMiddleware } from '../lib/utils/middleware'
import * as plugins from './plugins/tree'


export function buildRoutes(tree) {
  // const treeWithLayouts = applyLayouts(tree)
  // const routes = flattenTree(tree)
  return routes
    .filter(route => !route.isLayout)
    .map(decorateRoute)
    .sort((c, p) => (c.ranking >= p.ranking ? -1 : 1))
}

const decorateRoute = function (route) {


  route.params = {}

  return route
}



export function buildClientTree(tree) {
  const order = [
    "setShortPath",
    "setRank",
    "setIsIndexable",
    "assignRelations",
    "assignIndex",
    "assignLayout",
    "addMetaChildren",
    "setPrototype",
    "assignAPI",
    "sortByIndex",
    "setParams",
    "setRegex",
    "setName", //navigatable name
    // routes
    "createFlatList"
  ]

  const payload = { tree, routes: [] }
  for (let name of order) {
    plugins[name].sync(payload)
  }

  payload.routes = payload.routes.sort((c, p) => (c.ranking >= p.ranking ? -1 : 1))
  return payload
}