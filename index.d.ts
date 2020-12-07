/// <reference path="./typedef.js" />

declare module '@roxi/routify' {
  export * from '@roxi/routify/typings/runtime/helpers'
  export * from '@roxi/routify/typings/runtime/store'
  export const Router: typeof import('./runtime/Router.svelte').default
  export const routify: typeof import('@roxi/routify/plugins/rollup')

  global {
    export const $page: ClientNodeApi
    export const $layout: ClientNodeApi
    export const $params: import('./typings/runtime/helpers').ParamsHelper
    export const $leftover: import('./typings/runtime/helpers').LeftoverHelper
    export const $url: import('./typings/runtime/helpers').UrlHelper
    export const $isActive: import('./typings/runtime/helpers').IsActiveHelper
    export const $goto: import('./typings/runtime/helpers').GotoHelper
    export const $beforeUrlChange: import('./typings/runtime/helpers').BeforeUrlChangeHelper
    export const $ready: import('./typings/runtime/helpers').ReadyHelper
  }
}

declare module '@roxi/routify/tmp/routes' {
  export const tree: ClientNode
  export const routes: ClientNode[]
}

declare module '@roxi/routify/hmr' {
  let hmr: typeof import('./typings/hmr').default
  export default hmr
}
