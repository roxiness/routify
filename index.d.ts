/// <reference path="./typedef.js" />

declare module '@sveltech/routify' {
    export class Router {}
    
    export const url: SvelteStore
    global {
        export function $url(path?: string, params?: object, options?: object): string
    }
}