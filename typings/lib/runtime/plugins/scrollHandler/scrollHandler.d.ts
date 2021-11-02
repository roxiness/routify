export namespace scrollHandler {
    export { isScrolling };
    export { run };
}
declare const isScrolling: import("../../../../node_modules/svelte/store").Writable<boolean>;
/**
 * runs after each navigation
 * @param {{route: Route}} ctx
 * @param {*} history
 * @returns
 */
declare function run({ route }: {
    route: Route;
}, history: any): void;
export {};
