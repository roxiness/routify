/** @typedef {{elem: HTMLElement, context: RenderContext}} ElementHolder */
export class ScrollHandler {
    /** @param {Router} router */
    constructor(router: Router, coolOffTime?: number);
    coolOffTime: number;
    router: import("../index.js").RouterClass;
    onScrollIsActive: boolean;
    stopPersistent: () => any;
    listenForScroll: boolean;
    onScrollThrottled(): void;
    onScroll(): void;
}
export type ElementHolder = {
    elem: HTMLElement;
    context: RenderContext;
};
