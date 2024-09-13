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
    strategy: "closest" | "lowestAboveThreshold" | "withinThreshold";
    boundaryAnchorX: "center" | "left" | "right";
    boundaryAnchorY: "center" | "top" | "bottom";
    targetAnchorX: "center" | "left" | "right";
    targetAnchorY: "center" | "top" | "bottom";
    /**
     * @param {HTMLElement} element
     */
    getElementPos(element: HTMLElement, xPos?: string, yPos?: string): any[];
    findFocusedElement(elems: any): any;
}
export type RouteOnScrollOptions = {
    /**
     * - The threshold at which the strategy is triggered.
     */
    threshold: number;
    /**
     * - Defines the scroll direction to be monitored.
     */
    direction: 'both' | 'vertical' | 'horizontal';
    /**
     * -
     * - 'lowestAboveThreshold': Selects the item just above the threshold.
     * - 'withinThreshold': Selects any item within the threshold range.
     * - 'closest': Selects the item closest to the boundary anchor, regardless of position.
     */
    strategy: 'lowestAboveThreshold' | 'withinThreshold' | 'closest';
    /**
     * - X anchor point for boundary alignment.
     */
    boundaryAnchorX: 'left' | 'center' | 'right';
    /**
     * - Y anchor point for boundary alignment.
     */
    boundaryAnchorY: 'top' | 'center' | 'bottom';
    /**
     * - X anchor point for target alignment.
     */
    targetAnchorX: 'left' | 'center' | 'right';
    /**
     * - Y anchor point for target alignment.
     */
    targetAnchorY: 'top' | 'center' | 'bottom';
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
