
/**
 * @sveltech/routify 1.0.6
 * File generated Sat Mar 14 2020 00:22:14 GMT+0100 (Central European Standard Time)
 */

//buildRoutes
import { buildRoutes } from "/home/eric/projects/routify/routify/runtime/buildRoutes"

//dynamic imports
import __layout from '/pages/_layout.svelte'
import _foo__layout from '/pages/foo/_layout.svelte'
import _foo_index from '/pages/foo/index.svelte'
import _index from '/pages/index.svelte'

//keys
const keys = ["isFallback","isIndex","hasParam","path","component","layouts","meta","shortPath"]

//layouts
const layouts = {
  "/_layout": {
    "component": () => __layout,
    "meta": {},
    "relativeDir": "",
    "path": ""
  },
  "/foo/_layout": {
    "component": () => _foo__layout,
    "meta": {},
    "relativeDir": "/foo",
    "path": "/foo"
  }
}


//raw routes
const _routes = [
  {
    "component": () => _foo_index,
    "meta": {},
    "isIndex": true,
    "isFallback": false,
    "hasParam": false,
    "path": "/foo/index",
    "shortPath": "/foo",
    "layouts": [
      layouts['/_layout'],
      layouts['/foo/_layout']
    ]
  },
  {
    "component": () => _index,
    "meta": {},
    "isIndex": true,
    "isFallback": false,
    "hasParam": false,
    "path": "/index",
    "shortPath": "",
    "layouts": [
      layouts['/_layout']
    ]
  }
]

//options
export const options = {}

//routes
export const routes = buildRoutes(_routes, keys)
