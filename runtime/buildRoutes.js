
import { createNodeMiddleware } from '../lib/utils/middleware'
import * as plugins from './plugins/tree'



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

  payload.routes.sort((c, p) => (c.ranking >= p.ranking ? -1 : 1))
  return payload
}