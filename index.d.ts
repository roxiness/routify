/// <reference path="./typedef.js" />
/// <reference path="./tmp/routes" />

declare module '@sveltech/routify' {
    export class Router {}
    
    export const url: SvelteStore
    global {
        export function $url(path?: string, params?: object, options?: object): string
        // export function $layout(path?: string, params?: object, options?: object): string
    }
}

declare module '@sveltech/routify/tmp/routes' {
    export const tree: ClientNode
    export const routes: ClientNode[]
}