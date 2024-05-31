export class ScrollContext {
    /**
     * @param {RenderContext} context
     */
    constructor(context: RenderContext)
    /** @type {HTMLElement} */
    elem: HTMLElement
    /** @type {RenderContext} */
    ctx: RenderContext
    /** @type {boolean} */
    isInstant: boolean
    /** @type {HTMLElement} */
    scrollTarget: HTMLElement
    init(): Promise<void>
    isInlineOrHash: true | HTMLElement
    boundary: HTMLElement
    getNearestScrollLock(): Promise<HTMLElement>
    handleScrollInstructions(): Promise<any>
}
