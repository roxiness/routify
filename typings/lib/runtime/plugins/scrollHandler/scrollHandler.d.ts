export namespace scrollHandler {
    export { isScrolling };
    export { run };
}
declare const isScrolling: import("svelte/store").Writable<boolean>;
/**
 * runs after each navigation
 * @param {import('svelte/store').Readable<Route>} activeRoute
 * @param {*} history
 * @returns
 */
declare function run(activeRoute: import('svelte/store').Readable<Route>, history: any): void;
export {};
