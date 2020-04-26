/// <reference path="./typedef.js" />

declare module '@sveltech/routify' {  
    export * from './types/runtime/helpers'
    export * from './types/runtime/store'
    export const Router: import('svelte/internal').SvelteComponent
    
    global {
        export const $page:ClientNodeApi
        export const $layout:ClientNodeApi
        export const $params:import('./types/runtime/helpers').ParamsHelper
        export const $leftover:import('./types/runtime/helpers').LeftoverHelper
        export const $url: import('./types/runtime/helpers').UrlHelper
        export const $isActive: import('./types/runtime/helpers').IsActiveHelper
        export const $goto: import('./types/runtime/helpers').GotoHelper
        export const $beforeUrlChange: import('./types/runtime/helpers').BeforeUrlChangeHelper
        export const $ready: import('./types/runtime/helpers').ReadyHelper
        export let $basepath: String
    }
}

declare module '@sveltech/routify/tmp/routes' {
    export const tree: ClientNode
    export const routes: ClientNode[]
}