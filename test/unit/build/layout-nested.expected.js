
    import __layout from '/pages/_layout.svelte'
import _foo__layout from '/pages/foo/_layout.svelte'
import _index from '/pages/index.svelte'
import _foo_index from '/pages/foo/index.svelte'


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
},
{
  "isLayout": false,
  "isFallback": false,
  "isIndex": true,
  "hasParam": false,
  "path": "/foo/index",
  "regex": "^/foo(/index)?/?$",
  "name": "foo/index",
  "ranking": "Z",
  "url": "/foo/index",
  "component": () => _foo_index,
  "layouts": [
    {
      "path": "/",
      "url": "/",
      "filepath": "/_layout.svelte",
      "component": () => __layout
    },
    {
      "path": "/foo/",
      "url": "/foo/",
      "filepath": "/foo/_layout.svelte",
      "component": () => _foo__layout
    }
  ]
}
]

    export const options = {}
    