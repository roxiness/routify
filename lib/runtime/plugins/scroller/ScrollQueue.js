export class ScrollQueue {
    /** @type {{elem: HTMLElement, callback: function}[]} */
    asyncQueue = []

    /** instructions not yet received */
    pendingInstructions = 0

    /**
     * Adds an element to the queue with its respective callback function.
     * @param {function} callback - The callback function to execute.
     * @param {HTMLElement} elem - The element to be added to the queue.
     */
    pushAsync(callback, elem) {
        this.asyncQueue.push({ elem, callback })
    }

    /**
     * Processes the queue of elements and callbacks to execute them sequentially.
     * @return {Promise<void>} A promise that resolves when the entire queue has been processed.
     */
    async processQueue() {
        while (this.asyncQueue.length) {
            const { elem, callback } = this.asyncQueue.shift()
            await callback(elem, false)
        }
    }

    destroy() {
        this.asyncQueue = []
    }
}

export const scrollQueue = new ScrollQueue()
