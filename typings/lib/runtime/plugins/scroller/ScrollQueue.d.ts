export class ScrollQueue {
    /** @type {ScrollContext[]} */
    queue: ScrollContext[];
    /**
     * Adds an element to the queue with its respective callback function.
     * @param {ScrollContext} scrollContext
     */
    push(scrollContext: ScrollContext): void;
    /**
     * Processes the queue of elements and callbacks to execute them sequentially.
     * @return {Promise<void>} A promise that resolves when the entire queue has been processed.
     */
    processQueue(): Promise<void>;
}
export const scrollQueue: ScrollQueue;
