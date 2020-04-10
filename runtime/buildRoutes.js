

import * as miscPlugins from './plugins/tree'
import { assignAPI } from './plugins/assignAPI'

const plugins = {...miscPlugins, assignAPI}

export function buildClientTree(tree) {
  const order = [
    // pages
    "setParamKeys", //pages only
    "setRegex", //pages only
    "setShortPath", //pages only
    "setRank", //pages only
    "assignLayout", //pages only,
    // all
    "setPrototype",
    "addMetaChildren",
    "assignRelations", //all (except meta components?)
    "setIsIndexable", //all
    "assignIndex", //all
    "assignAPI", //all
    // routes
    "createFlatList"
  ]

  const payload = { tree, routes: [] }
  for (let name of order) {
    const syncFn = plugins[name].sync || plugins[name]
    syncFn(payload)
  }
  return payload
}