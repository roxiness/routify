
    import __layout from '/pages/_layout.svelte'
import _foo__layout from '/pages/foo/_layout.svelte'
import _foo_index from '/pages/foo/index.svelte'
import _index from '/pages/index.svelte'


 import { buildRoutes } from "/home/eric/projects/routify/routify/runtime/buildRoutes"


 const layouts = {
["/_layout"]:{
  "component": () => __layout,
  "path": "/"
},["/foo/_layout"]:{
  "component": () => _foo__layout,
  "path": "/foo/"
}
}


 export const routeKeys = ["isFallback","isIndex","hasParam","path","component","layouts"]


 const _routes = [
{
  "isFallback": false,
  "isIndex": true,
  "hasParam": false,
  "path": "/foo/index",
  "component": () => _foo_index,
  "layouts": [
    layouts['/_layout'],
    layouts['/foo/_layout']
  ]
},
{
  "isFallback": false,
  "isIndex": true,
  "hasParam": false,
  "path": "/index",
  "component": () => _index,
  "layouts": [
    layouts['/_layout']
  ]
}
]


 export const routes = buildRoutes(_routes, routeKeys)

    export const options = {}
    