import { ScrollContext } from './ScrollContext'

/**
 * returns true if we're at the last element in the array
 * @param {ScrollContext} _scrollContext
 * @param {number} index
 * @param {ScrollContext[]} ScrollContexts
 */
const shouldScrollCb = (_scrollContext, index, ScrollContexts) => {
    return (
        ScrollContexts.filter(
            scrollContext => scrollContext.scrollLock === _scrollContext.scrollLock,
        ).pop() === _scrollContext
    )
}

/**
 *
 * @param {HTMLElement} elem
 * @param {HTMLElement} scrollLock
 */
export const scrollToTop = (elem, scrollLock) => {
    let parent = elem.parentElement
    while (parent && scrollLock !== parent) {
        const oldBehavior = parent.style.scrollBehavior

        // override scroll behavior of the element to make it scroll instantly
        parent.style.scrollBehavior = 'auto'
        parent.scrollTo(0, 0)
        parent.style.scrollBehavior = oldBehavior

        parent = parent.parentElement
    }
}

export class ScrollQueue {
    /** @type {{scrollCtx: ScrollContext, promise: Promise}[]} */
    queue = []

    /**
     * Adds an element to the queue with its respective callback function.
     * @param {RenderContext} renderContext
     */
    async push(renderContext) {
        const scrollContext = new ScrollContext(renderContext)

        // empty queue if we're on a new route
        if (scrollContext.route != this.queue[0]?.scrollCtx.route) this.queue = []

        this.queue.push({ scrollCtx: scrollContext, promise: scrollContext.init() })
    }

    /**
     * Processes the queue of elements and callbacks to execute them sequentially.
     * @return {Promise<void>} A promise that resolves when the entire queue has been processed.
     */
    async processQueue() {
        await Promise.all(this.queue.map(({ promise }) => promise))
        const queue = this.queue
            .map(({ scrollCtx }) => scrollCtx)
            .filter(scrollCtx => scrollCtx.elem)

        // todo is this still needed?
        // Required when navigating back and forth between cashed routes. Not sure why this is needed. Scroll to top should already be done.
        await new Promise(resolve => setTimeout(resolve, 0))

        const isRegular = scrollCtx => !scrollCtx.ctx.isInline && !scrollCtx.hashElem
        const isInlineOrHash = scrollCtx => scrollCtx.ctx.isInline || scrollCtx.hashElem
        const shouldScroll = (scrollCtx, index, arr) =>
            scrollCtx.ctx.inline.shouldScroll(scrollCtx, index, arr, shouldScrollCb)

        this.processRegularQueue(queue.filter(isRegular))
        this.processInlineAndHashQueue(queue.filter(isInlineOrHash).filter(shouldScroll))
    }

    /**
     * @param {ScrollContext[]} scrollContexts
     */
    processRegularQueue(scrollContexts) {
        for (const scrollContext of scrollContexts)
            scrollToTop(scrollContext.elem, scrollContext.scrollLock)
    }

    /**
     * @param {ScrollContext[]} scrollContexts
     */
    async processInlineAndHashQueue(scrollContexts) {
        // todo create alternative strategies for inline processing? E.g.
        // 1) scroll chronologically and don't force instants
        // 2) scroll all inline elements at once
        // 3) scroll all inline elements at once but force instants
        // 4) force instant on all except the last element
        // 5) force instant on all except the first element

        const firstScrollContext = scrollContexts.shift()
        for (const scrollContext of scrollContexts) {
            scrollContext.isInstant = true
            await scrollContext.handleScrollInstructions()
        }

        if (firstScrollContext) await firstScrollContext.handleScrollInstructions()
    }
}

export const scrollQueue = new ScrollQueue()
