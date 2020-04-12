/// <reference path="./typedef.js" />

declare module '@sveltech/routify' {
    export class Router {}
    
    export const url: SvelteStore
    export const goto: SvelteStore
    export const params: SvelteStore
    export const isActive: SvelteStore
    export const leftover: SvelteStore
    export const beforeUrlChange: SvelteStore
    export const focus: SvelteStore
    export const ready: SvelteStore
    export const getConcestor: SvelteStore

    global {
        export function $url(path?: string, params?: object, options?: UrlOptions): string
        export function $isActive(path?: string, params?: object, options?: UrlOptions): boolean
        export function $goto(path?: string, params?: object, options?: GotoOptions): void
        export const $params:Params
        export const $leftover:string
        export function $beforeUrlChange(callback: function): void
        export function $focus(element: HTMLElement): void
        export function $ready(): void
        export function $getConcestor(page1: ClientNodeApi, page2: ClientNodeApi): ConcestorReturn
    }
}

declare module '@sveltech/routify/tmp/routes' {
    export const tree: ClientNode
    export const routes: ClientNode[]
}

interface Params {[key: string]: String}