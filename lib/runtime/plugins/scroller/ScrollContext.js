import { resolveIfAnonFn, waitFor } from '../../utils/index.js'
import {
    backupScrollBehavior,
    getAllAncestors,
    observeDocument,
    restoreScrollBehavior,
    waitForScrollToComplete,
} from './utils.js'

export class ScrollContext {
    /** @type {HTMLElement} */
    elem

    /** @type {RenderContext} */
    ctx

    /** @type {boolean} */
    isInstant

    /** @type {HTMLElement} */
    scrollTarget

    async getBoundary() {
        return resolveIfAnonFn(this.ctx.scrollBoundary, [this.ctx, this.scrollTarget])
    }

    /**
     * @param {RenderContext} context
     */
    constructor(context) {
        this.ctx = context
    }

    async init() {
        const { ctx } = this
        const { anchor, parent } = await waitFor(ctx.elem, Boolean)

        this.scrollTarget = anchor || parent

        const hashElem =
            ctx.route?.hash && globalThis.document?.getElementById(ctx.route?.hash)

        this.elem = hashElem || this.scrollTarget

        this.scrollToElem = ctx.isInline || ctx.route?.hash

        this.isInstant = ctx.route?.state.dontsmoothscroll || !ctx.wasVisible
    }

    async handleScrollInstructions() {
        const { elem, isInstant, ctx } = this
        const { scrollIntoView } = ctx.inline

        const ancestors = getAllAncestors(elem)
        ancestors.forEach(backupScrollBehavior)

        if (isInstant)
            ancestors.forEach(ancestor => (ancestor.style.scrollBehavior = 'auto'))

        const observer = observeDocument(() => scrollIntoView(elem, isInstant), true)
        const timeout = isInstant ? 300 : 0
        setTimeout(() => {
            observer.disconnect()
            ancestors.forEach(restoreScrollBehavior)
        }, timeout)
        return waitForScrollToComplete(elem)
    }
}
