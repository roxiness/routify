export namespace scrollHandler {
    export { isScrolling };
    export { run };
}
declare const isScrolling: import("svelte/store").Writable<boolean>;
/**
 * runs after each navigation
 * @type {import('../../Router/Router').AfterUrlChangeCallback}
 */
declare const run: import('../../Router/Router').AfterUrlChangeCallback;
export {};
