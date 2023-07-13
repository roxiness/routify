export function scrollToContext(context: RenderContext): Promise<void>;
export function scrollToTop(elem: HTMLElement, boundary: HTMLElement): void;
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
    getBoundary(): Promise<HTMLElement>;
    init(): Promise<void>;
    scrollToElem: string | true;
    handleScrollInstructions(): Promise<any>;
}
