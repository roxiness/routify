/** @type {import('svelte/store').Writable<RouteNode>} */
export const route: import('svelte/store').Writable<RouteNode>;
/** @type {import('svelte/store').Writable<RouteNode[]>} */
export const routes: import('svelte/store').Writable<RouteNode[]>;
export let rootContext: import("svelte/store").Writable<{
    component: {
        params: {};
    };
}>;
/** @type {import('svelte/store').Writable<RouteNode>} */
export const urlRoute: import('svelte/store').Writable<RouteNode>;
export const prefetchPath: import("svelte/store").Writable<string>;
export const isChangingPage: import("svelte/store").Writable<boolean>;
