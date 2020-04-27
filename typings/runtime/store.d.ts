/** @type {import('svelte/store').Writable<RouteNode>} */
export const route: import('svelte/store').Writable<RouteNode>;
export const routes: import("svelte/store").Writable<any[]>;
/** @type {import('svelte/store').Writable<RouteNode>} */
export const urlRoute: import('svelte/store').Writable<RouteNode>;
/**
 * @typedef {import('svelte/store').Writable<String>} Basepath
 * @type {Basepath} */
export const basepath: Basepath;
export const location: import("svelte/store").Readable<{
    base: string;
    path: string;
}>;
export type Basepath = import("svelte/store").Writable<string>;
