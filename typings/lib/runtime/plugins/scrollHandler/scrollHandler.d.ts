export namespace scrollHandler {
    export { isScrolling };
    export { run };
}
declare const isScrolling: import("svelte/store").Writable<boolean>;
declare function run(activeRoute: any, history: any): void;
export {};
