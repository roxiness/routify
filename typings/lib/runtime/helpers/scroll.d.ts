/**
 * @type {import('./scroll')['persistentScrollTo']}
 * @param {HTMLElement} el
 * @param {ScrollIntoViewOptions} options
 * @param {number} timeout
 */
export const persistentScrollTo: typeof import("./scroll")['persistentScrollTo'];
export function getScrollBoundaries(): HTMLElement[];
export function scopedScrollIntoView(elem: HTMLElement, limits?: HTMLElement[] | undefined): void;
