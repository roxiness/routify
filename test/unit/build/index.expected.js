
/**
 * @sveltech/routify 1.0.6
 * File generated Sat Mar 14 2020 00:22:14 GMT+0100 (Central European Standard Time)
 */

//buildRoutes
import { buildRoutes } from "/home/eric/projects/routify/routify/runtime/buildRoutes"

//dynamic imports
import _index from '/pages/index.svelte'

//keys
const keys = ["isFallback","isIndex","hasParam","path","component","layouts","meta","shortPath"]

//layouts
const layouts = {}


//raw routes
const _routes = [
  {
    "component": () => _index,
    "meta": {},
    "isIndex": true,
    "isFallback": false,
    "hasParam": false,
    "path": "/index",
    "shortPath": "",
    "layouts": []
  }
]

//options
export const options = {}

//routes
export const routes = buildRoutes(_routes, keys)
