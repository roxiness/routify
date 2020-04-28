/// <reference path="./typedef.js" />

declare module '@sveltech/routify' {  
    export * from '@sveltech/routify/typings/runtime/helpers'
    export * from '@sveltech/routify/typings/runtime/store'
    export const Router: import('svelte/internal').SvelteComponent
    export const routify: typeof import('@sveltech/routify/plugins/rollup')
    
    global {
        export const $page:ClientNodeApi
        export const $layout:ClientNodeApi
        export const $params:import('./typings/runtime/helpers').ParamsHelper
        export const $leftover:import('./typings/runtime/helpers').LeftoverHelper
        export const $url: import('./typings/runtime/helpers').UrlHelper
        export const $isActive: import('./typings/runtime/helpers').IsActiveHelper
        export const $goto: import('./typings/runtime/helpers').GotoHelper
        export const $beforeUrlChange: import('./typings/runtime/helpers').BeforeUrlChangeHelper
        export const $ready: import('./typings/runtime/helpers').ReadyHelper
        export let $basepath: String
    }
}

declare module '@sveltech/routify/tmp/routes' {
    export const tree: ClientNode
    export const routes: ClientNode[]
}