export function persistentScopedScrollIntoView(_elem: HTMLElement | ((elem: HTMLElement) => HTMLElement), _boundary?: HTMLElement | ((elem: HTMLElement) => HTMLElement), options?: ScrollIntoViewOptions, timeout?: number): Promise<any> | (() => void);
export function observeDocument(callback: any, runOnInit: any, timeout: any): MutationObserver;
export function scrollIntoView(elem: HTMLElement, callback: any, instant: boolean): Promise<void>;
export function scrollToTop(elem: HTMLElement, boundary: HTMLElement): void;
export class ScrollIntoViewQueue {
    currentId: any;
    /** @type {{elem: HTMLElement, callback: function, instant: boolean}[]} */
    queue: {
        elem: HTMLElement;
        callback: Function;
        instant: boolean;
    }[];
    /**
     * Adds an element to the queue with its respective callback function and instant flag.
     * If the ID is different from the current ID, clears the queue and starts processing it.
     * @param {HTMLElement} elem - The element to be added to the queue.
     * @param {function} callback - The callback function to execute.
     * @param {boolean} instant - Flag to indicate if the function should be executed immediately.
     * @param {any} id - The identifier of the element being added.
     */
    push(elem: HTMLElement, callback: Function, instant: boolean, id: any): void;
    /**
     * Processes the queue of elements and callbacks to execute them sequentially.
     * @return {Promise<void>} A promise that resolves when the entire queue has been processed.
     */
    processQueue(): Promise<void>;
    runCallback(elem: any, callback: any, instant: any): Promise<any>;
}
export function scrollToContext(context: RenderContext): Promise<void>;
export function getAllAncestors(elem: HTMLElement): HTMLElement[];
