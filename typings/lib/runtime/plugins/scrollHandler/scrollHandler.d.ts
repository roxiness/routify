export function createScrollHandler(): {
    isScrolling: import("svelte/store").Writable<boolean>;
    run: AfterUrlChangeCallback;
};
