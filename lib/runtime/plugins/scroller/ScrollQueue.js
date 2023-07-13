/**
 * returns true if we're at the last element in the array
 * @param {ScrollContext} _scrollContext
 * @param {number} index
 * @param {ScrollContext[]} ScrollContexts
 */
const defaultShouldScrollCallback = (_scrollContext, index, ScrollContexts) =>
    index === ScrollContexts.length - 1

export class ScrollQueue {
    /** @type {ScrollContext[]} */
    queue = []

    /**
     * Adds an element to the queue with its respective callback function.
     * @param {ScrollContext} scrollContext
     */
    push(scrollContext) {
        // empty queue if we're on a new route
        if (scrollContext.ctx.route != this.queue[0]?.ctx.route) this.queue = []

        this.queue.push(scrollContext)
    }

    /**
     * Processes the queue of elements and callbacks to execute them sequentially.
     * @return {Promise<void>} A promise that resolves when the entire queue has been processed.
     */
    async processQueue() {
        // filter the queue so only shouldScroll elements and the last element are left
        this.queue = this.queue.filter((scrollContext, index, arr) =>
            scrollContext.ctx.inline.shouldScroll(
                scrollContext,
                index,
                arr,
                defaultShouldScrollCallback,
            ),
        )

        while (this.queue.length) {
            const scrollContext = this.queue.shift()
            await scrollContext.handleScrollInstructions()
        }
    }
}

export const scrollQueue = new ScrollQueue()
