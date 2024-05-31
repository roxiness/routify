export function scrollToTop(elem: HTMLElement, scrollLock: HTMLElement): void;
export class ScrollQueue {
    /** @type {{scrollCtx: ScrollContext, promise: Promise}[]} */
    queue: {
        scrollCtx: ScrollContext;
        promise: Promise<any>;
    }[];
    /**
     * Adds an element to the queue with its respective callback function.
     * @param {RenderContext} renderContext
     */
    push(renderContext: RenderContext): Promise<void>;
    /**
     * Processes the queue of elements and callbacks to execute them sequentially.
     * @return {Promise<void>} A promise that resolves when the entire queue has been processed.
     */
    processQueue(): Promise<void>;
    /**
     * @param {ScrollContext[]} scrollContexts
     */
    processRegularQueue(scrollContexts: ScrollContext[]): void;
    /**
     * @param {ScrollContext[]} scrollContexts
     */
    processInlineAndHashQueue(scrollContexts: ScrollContext[]): Promise<void>;
}
export const scrollQueue: ScrollQueue;
import { ScrollContext } from './ScrollContext';
