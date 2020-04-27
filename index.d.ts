/// <reference path="./typedef.js" />

declare module '@sveltech/routify' {  
    export * from '@sveltech/routify/runtime/helpers'
    export * from '@sveltech/routify/runtime/store'
    export const Router: import('svelte/internal').SvelteComponent
    
    global {
        export const $page:ClientNodeApi
        export const $layout:ClientNodeApi
        export const $params:import('./runtime/helpers').ParamsHelper
        export const $leftover:import('./runtime/helpers').LeftoverHelper
        export const $url: import('./runtime/helpers').UrlHelper
        export const $isActive: import('./runtime/helpers').IsActiveHelper
        export const $goto: import('./runtime/helpers').GotoHelper
        export const $beforeUrlChange: import('./runtime/helpers').BeforeUrlChangeHelper
        export const $ready: import('./runtime/helpers').ReadyHelper
        export let $basepath: String
    }
}

declare module '@sveltech/routify/tmp/routes' {
    export const tree: ClientNode
    export const routes: ClientNode[]
}