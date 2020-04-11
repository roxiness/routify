/// <reference path="./typedef.js" />
/// <reference path="./tmp/routes" />

declare module '@sveltech/routify' {
    export class Router {}
    
    export const url: SvelteStore
    export const goto: SvelteStore
    export const params: SvelteStore
    export const isActive: SvelteStore

    global {
        export function $url(path?: string, params?: object, options?: UrlOptions): string
        export function $isActive(path?: string, params?: object, options?: UrlOptions): string
        export function $goto(path?: string, params?: object, options?: GotoOptions): string
        export const $params:Params = {}
    }
}

declare module '@sveltech/routify/tmp/routes' {
    export const tree: ClientNode
    export const routes: ClientNode[]
}

interface Params {[key: string]: String}