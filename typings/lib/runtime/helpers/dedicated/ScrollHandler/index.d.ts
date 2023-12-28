export function getChildNodesElements(context?: (RouterContext | RenderContext) | undefined): HTMLElement[];
export function getDescendantNodesElements(context?: (RouterContext | RenderContext) | undefined): HTMLElement[];
/**
 * ScrollHandler detects when the user scrolls to a new inlined page and updates the router accordingly
 *
 */
export class ScrollHandler {
    /**
     * ScrollHandler2 detects when the user scrolls to a new inlined page and updates the router accordingly
     * @param {Partial<ScrollHandlerOptions>} options
     * */
    constructor(options?: Partial<ScrollHandlerOptions>);
    /** @type {Route} */
    lastRoute: Route;
    /** @type {HTMLElement[]} */
    elems: HTMLElement[];
    cutoff: number;
    direction: "both" | "vertical" | "horizontal";
    id: symbol;
    coolOffTime: number;
    throttleTime: number;
    getElems: (context: import("../../../renderer/RenderContext.js").RenderContext | import("../../../renderer/RenderContext.js").RouterContext) => HTMLElement[];
    onScrollIsActive: boolean;
    stopPersistent: () => any;
    listenForScroll: boolean;
    context: import("../../../renderer/RenderContext.js").RenderContext | import("../../../renderer/RenderContext.js").RouterContext;
    onScrollThrottled(): void;
    onScroll(): void;
    lastContext: import("../../../renderer/RenderContext.js").RenderContext | import("../../../renderer/RenderContext.js").RouterContext;
    subscribe(run: any): () => void;
}
export type ScrollHandlerOptions = {
    coolOffTime: number;
    throttleTime: number;
    cutoff: number;
    direction: 'both' | 'vertical' | 'horizontal';
    getElems: (context: RouterContext | RenderContext) => HTMLElement[];
    /**
     * *
     */
    context: RouterContext | RenderContext;
};
