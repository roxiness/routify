/// <reference path="./typedef.js" />

declare module '@sveltech/routify' {    
    export const Router: import('svelte/internal').SvelteComponent    
    export const url: import('./runtime/helpers.js').UrlHelperStore
    export const goto: import('./runtime/helpers.js').GotoHelperStore
    export const params: import('./runtime/helpers.js').ParamsHelperStore
    export const isActive: import('./runtime/helpers.js').IsActiveHelperStore
    export const leftover: import('./runtime/helpers.js').LeftoverHelperStore
    export const beforeUrlChange: import('./runtime/helpers.js').BeforeUrlChangeHelperStore
    export const ready: import('./runtime/helpers.js').ReadyHelperStore
    export const focus: import('./runtime/helpers.js').FocusHelper
    export const getConcestor: import('./runtime/helpers.js').GetConcestor

    global {
        export const $params:import('./runtime/helpers.js').ParamsHelper
        export const $leftover:import('./runtime/helpers.js').LeftoverHelper
        export const $url: import('./runtime/helpers.js').UrlHelper
        export const $isActive: import('./runtime/helpers.js').IsActiveHelper
        export const $goto: import('./runtime/helpers.js').GotoHelper
        export const $beforeUrlChange: import('./runtime/helpers.js').BeforeUrlChangeHelper
        export const $ready: import('./runtime/helpers.js').ReadyHelper
    }
}

declare module '@sveltech/routify/tmp/routes' {
    export const tree: ClientNode
    export const routes: ClientNode[]
}