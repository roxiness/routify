
    import __layout from '/pages/_layout.svelte'
import _index from '/pages/index.svelte'


 export const routes = [
{
  "isLayout": false,
  "isFallback": false,
  "isIndex": true,
  "hasParam": false,
  "path": "/index",
  "regex": "^(/index)?/?$",
  "name": "/index",
  "ranking": "Z",
  "url": "/index",
  "component": () => _index,
  "layouts": [
    {
      "path": "/",
      "url": "/",
      "filepath": "/_layout.svelte",
      "component": () => __layout
    }
  ]
}
]

    export const options = {}
    