export class ScrollContext {
    /**
     * @param {RenderContext} context
     */
    constructor(context: RenderContext);
    /** @type {HTMLElement} */
    elem: HTMLElement;
    /** @type {RenderContext} */
    ctx: RenderContext;
    /** @type {boolean} */
    isInstant: boolean;
    /** @type {HTMLElement} */
    scrollTarget: HTMLElement;
    route: import("../../Route/Route.js").Route;
    init(): Promise<void>;
    hashElem: HTMLElement;
    scrollLock: HTMLElement;
    getNearestScrollLock(): Promise<HTMLElement>;
    handleScrollInstructions(): Promise<any>;
}
