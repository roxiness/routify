import { defaultScrollIntoView } from '../../renderer/utils/normalizeInline.js'
import { resolveIfAnonFn, waitFor } from '../../utils/index.js'
import {
    backupScrollBehavior,
    getAllAncestors,
    getNearestScrollLock,
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

        const hash = ctx.route?.sourceUrl.hash.slice(1)
        const hashElem = hash && globalThis.document?.getElementById(hash)
        this.elem = hashElem || this.scrollTarget

        this.shouldScrollToElem = ctx.isInline || hashElem

        this.isInstant = ctx.route?.state.dontsmoothscroll || !ctx.wasVisible

        this.boundary = await this.getNearestBoundary()
    }

    async getNearestBoundary() {
        // set boundaries
        const ctxBoundary = await resolveIfAnonFn(this.ctx.scrollBoundary, [
            this.ctx,
            this.scrollTarget,
        ])

        /** @type {HTMLElement[]} */
        const boundaries = Array.isArray(ctxBoundary) ? [...ctxBoundary] : [ctxBoundary]
        boundaries.push(getNearestScrollLock(this.elem))

        // get the boundary that's closest to the element
        let parentElem = this.elem.parentElement
        while (parentElem && !boundaries.includes(parentElem)) {
            parentElem = parentElem.parentElement
        }
        return parentElem
    }

    async handleScrollInstructions() {
        const { elem, isInstant, ctx } = this
        let { scrollIntoView } = ctx.inline

        // Native scrollIntoView doesn't work with boundaries
        if (scrollIntoView === defaultScrollIntoView && this.boundary) {
            scrollIntoView = await import('scroll-into-view-if-needed').then(
                r => elem =>
                    r.default(elem, { scrollMode: 'if-needed', boundary: this.boundary }),
            )
        }

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
