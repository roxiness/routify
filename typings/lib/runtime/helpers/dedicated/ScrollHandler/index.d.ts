export function getChildNodesElements(context?: (RouterContext | RenderContext) | undefined): HTMLElement[];
export function getDescendantNodesElements(context?: (RouterContext | RenderContext) | undefined): HTMLElement[];
/**
 * ScrollHandler detects when the user scrolls to a new inlined page and updates the router accordingly
 *
 */
export class BaseScrollHandler {
    /**
     * ScrollHandler2 detects when the user scrolls to a new inlined page and updates the router accordingly
     * @param {Partial<BaseScrollHandlerOptions>} options
     * */
    constructor(options?: Partial<BaseScrollHandlerOptions>);
    /** @type {Route} */
    lastRoute: Route;
    /** @type {HTMLElement[]} */
    elems: HTMLElement[];
    direction: any;
    id: symbol;
    coolOffTime: number;
    throttleTime: number;
    getElems: (context: import("../../../renderer/RenderContext.js").RenderContext | import("../../../renderer/RenderContext.js").RouterContext) => HTMLElement[];
    onScrollIsActive: boolean;
    stopPersistent: () => any;
    listenForScroll: boolean;
    context: import("../../../renderer/RenderContext.js").RenderContext | import("../../../renderer/RenderContext.js").RouterContext;
    /**
     * @param HTMLElement[]
     * @returns {HTMLElement}
     */
    findFocusedElement(elems: any): HTMLElement;
    scrollEvent: "scroll" | "scrollend";
    onScrollThrottled(): void;
    onScroll(): void;
    lastContext: import("../../../renderer/RenderContext.js").RenderContext | import("../../../renderer/RenderContext.js").RouterContext;
    subscribe(run: any): () => void;
}
export class ScrollHandler extends BaseScrollHandler {
    /**
     * ScrollHandler detects when the user scrolls to a new inlined page and updates the router accordingly
     * @param {Partial<BaseScrollHandlerOptions & ScrollHandlerOptions>} options
     * */
    constructor(options?: Partial<BaseScrollHandlerOptions & ScrollHandlerOptions>);
    threshold: number;
    direction: "both" | "vertical" | "horizontal";
    strategy: "lowestAboveThreshold" | "withinThreshold";
    findFocusedElement(elems: any): any;
}
export type ScrollHandlerOptions = {
    threshold: number;
    direction: 'both' | 'vertical' | 'horizontal';
    strategy: 'lowestAboveThreshold' | 'withinThreshold';
};
export type BaseScrollHandlerOptions = {
    threshold: number;
    coolOffTime: number;
    throttleTime: number;
    getElems: (context: RouterContext | RenderContext) => HTMLElement[];
    context: RouterContext | RenderContext;
    findFocusedElement: (elems: HTMLElement[]) => HTMLElement;
    scrollEvent: 'scroll' | 'scrollend';
};
