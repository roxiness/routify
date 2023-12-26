/** @typedef {{elem: HTMLElement, context: RenderContext}} ElementHolder */
export class ScrollHandler {
    /**
     * @param {Router} router
     * @param {Partial<defaultOptions>} options
     * */
    constructor(router: Router, options?: Partial<{
        coolOffTime: number;
        throttleTime: number;
        cutoff: number;
        /** @type {'both' | 'vertical' | 'horizontal'} */
        direction: "both" | "vertical" | "horizontal";
    }>);
    /** @type {Route} */
    lastRoute: Route;
    /** @type {HTMLElement[]} */
    lastElems: HTMLElement[];
    cutoff: number;
    direction: "both" | "vertical" | "horizontal";
    coolOffTime: number;
    throttleTime: number;
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
