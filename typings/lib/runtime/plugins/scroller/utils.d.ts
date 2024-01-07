/**
 * watches an element position relative to the viewport and waits for it to stop moving.
 * @param {HTMLElement} elem
 */
export function waitForScrollToComplete(elem: HTMLElement): Promise<any>;
export function getNearestScrollLock(elem: any): any;
export function observeDocument(callback: any, runOnInit: any, timeout: any): MutationObserver;
export function backupScrollBehavior(elem: any): void;
export function restoreScrollBehavior(elem: any): void;
export function getAllAncestors(elem: HTMLElement): HTMLElement[];
