export class ScrollQueue {
    /** @type {{elem: HTMLElement, callback: function}[]} */
    asyncQueue: {
        elem: HTMLElement;
        callback: Function;
    }[];
    /** instructions not yet received */
    pendingInstructions: number;
    /**
     * Adds an element to the queue with its respective callback function.
     * @param {function} callback - The callback function to execute.
     * @param {HTMLElement} elem - The element to be added to the queue.
     */
    pushAsync(callback: Function, elem: HTMLElement): void;
    /**
     * Processes the queue of elements and callbacks to execute them sequentially.
     * @return {Promise<void>} A promise that resolves when the entire queue has been processed.
     */
    processQueue(): Promise<void>;
    destroy(): void;
}
export const scrollQueue: ScrollQueue;
