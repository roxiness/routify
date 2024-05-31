import { resolveIfAnonFn, waitFor } from '../../utils/index.js'
import { observeDocument, waitForScrollToComplete } from './utils.js'

export class ScrollContext {
    /** @type {HTMLElement} */
    elem

    /** @type {RenderContext} */
    ctx

    /** @type {boolean} */
    isInstant

    /** @type {HTMLElement} */
    scrollTarget

    /**
     * @param {RenderContext} context
     */
    constructor(context) {
        this.ctx = context
        // the route in the context changes, so we store it here
        this.route = context.route
    }

    async init() {
        const { ctx } = this
        const { anchor, parent } = await waitFor(ctx.elem, Boolean)

        this.scrollTarget = anchor || parent

        const hash = ctx.route?.sourceUrl.hash.slice(1)
        this.hashElem = hash && globalThis.document?.getElementById(hash)
        this.elem = this.hashElem || this.scrollTarget

        this.isInstant = ctx.route?.state.dontsmoothscroll || !ctx.wasVisible

        this.scrollLock = await this.getNearestScrollLock()
    }

    async getNearestScrollLock() {
        // set boundaries
        const ctxBoundary = await resolveIfAnonFn(this.ctx.scrollLock, [
            this.ctx,
            this.scrollTarget,
            this,
        ])

        /** @type {HTMLElement[]} */
        const boundaries = Array.isArray(ctxBoundary) ? [...ctxBoundary] : [ctxBoundary]

        // get the boundary that's closest to the element
        let parentElem = this.elem.parentElement
        while (parentElem && !boundaries.includes(parentElem)) {
            parentElem = parentElem.parentElement
        }
        return parentElem
    }

    async handleScrollInstructions() {
        const onDocChange = () =>
            this.ctx.inline.scrollIntoView(this.elem, this.isInstant, {
                boundary: this.scrollLock,
            })
        observeDocument(onDocChange, true, 300)
        return waitForScrollToComplete(this.elem)
    }
}
