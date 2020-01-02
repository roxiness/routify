
    import __layout from '/pages/_layout.svelte'
import _index from '/pages/index.svelte'


 import { buildRoutes } from "/home/eric/projects/routify/routify/runtime/buildRoutes"


 const layouts = {
["/_layout"]:{
  "component": () => __layout,
  "path": "/"
}
}


 export const routeKeys = ["isFallback","isIndex","hasParam","path","component","layouts"]


 const _routes = [
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
    