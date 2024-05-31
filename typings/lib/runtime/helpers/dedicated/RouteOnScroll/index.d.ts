export function getChildNodesElements(context?: (RouterContext | RenderContext) | undefined): HTMLElement[];
export function getDescendantNodesElements(context?: (RouterContext | RenderContext) | undefined): HTMLElement[];
/**
 * RouteOnScroll detects when the user scrolls to a new inlined page and updates the router accordingly
 *
 */
export class BaseRouteOnScroll {
    /**
     * RouteOnScroll detects when the user scrolls to a new inlined page and updates the router accordingly
     * @param {Partial<BaseRouteOnScrollOptions>} options
     * */
    constructor(options?: Partial<BaseRouteOnScrollOptions>);
    /** @type {Route} */
    lastRoute: Route;
    /** @type {HTMLElement[]} */
    elems: HTMLElement[];
    direction: any;
    /** @type {HTMLElement} */
    boundaryElem: HTMLElement;
    id: symbol;
    $url: import("../../index.js").Url;
    coolOffTime: number;
    throttleTime: number;
    getElems: (context: import("../../../../../typings/lib/runtime/renderer/RenderContext.js").RenderContext | import("../../../../../typings/lib/runtime/renderer/RenderContext.js").RouterContext) => HTMLElement[];
    onScrollIsActive: boolean;
    stopPersistent: () => any;
    listenForScroll: boolean;
    context: import("../../../../../typings/lib/runtime/renderer/RenderContext.js").RenderContext | import("../../../../../typings/lib/runtime/renderer/RenderContext.js").RouterContext;
    /**
     * @param HTMLElement[]
     * @returns {HTMLElement}
     */
    findFocusedElement(elems: any): HTMLElement;
    scrollEvent: "scroll" | "scrollend";
    onScrollThrottled(): void;
    onScroll(): void;
    lastContext: import("../../../../../typings/lib/runtime/renderer/RenderContext.js").RenderContext | import("../../../../../typings/lib/runtime/renderer/RenderContext.js").RouterContext;
    subscribe(run: any): () => void;
}
export class RouteOnScroll extends BaseRouteOnScroll {
    /**
     * RouteOnScroll detects when the user scrolls to a new inlined page and updates the router accordingly
     * @param {Partial<BaseRouteOnScrollOptions & RouteOnScrollOptions>} options
     * */
    constructor(options?: Partial<BaseRouteOnScrollOptions & RouteOnScrollOptions>);
    threshold: number;
    direction: "both" | "vertical" | "horizontal";
    strategy: "lowestAboveThreshold" | "withinThreshold";
    getElementPos(element: any): any;
    findFocusedElement(elems: any): any;
}
export type RouteOnScrollOptions = {
    threshold: number;
    direction: 'both' | 'vertical' | 'horizontal';
    strategy: 'lowestAboveThreshold' | 'withinThreshold';
};
export type BaseRouteOnScrollOptions = {
    threshold: number;
    coolOffTime: number;
    throttleTime: number;
    getElems: (context: RouterContext | RenderContext) => HTMLElement[];
    context: RouterContext | RenderContext;
    findFocusedElement: (elems: HTMLElement[]) => HTMLElement;
    scrollEvent: 'scroll' | 'scrollend';
    /**
     * urlHelper
     */
    $url: import('../../index.js').Url;
};
