/**
 * Finds the next scrollable ancestor of an element within a specified boundary element.
 *
 * @param {HTMLElement} element - The element to find the next scrollable ancestor of.
 * @param {HTMLElement[]} boundaryElements - The element to stop searching for ancestors at.
 * @return {HTMLElement|null} The scrollable ancestor if found, otherwise null.
 */
export function findNextScrollableAncestor(element: HTMLElement, boundaryElements?: HTMLElement[]): HTMLElement | null;
/**
 * watches an element position relative to the viewport and waits for it to stop moving.
 * @param {HTMLElement} elem
 */
export function waitForScrollToComplete(elem: HTMLElement): Promise<any>;
export function observeDocument(callback: any, runOnInit: any, timeout: any): MutationObserver;
export function backupScrollBehavior(elem: any): void;
export function restoreScrollBehavior(elem: any): void;
export function getAllAncestors(elem: HTMLElement): HTMLElement[];
