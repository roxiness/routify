export function persistentScopedScrollIntoView(_elem: HTMLElement | ((elem: HTMLElement) => HTMLElement), _boundary?: HTMLElement | ((elem: HTMLElement) => HTMLElement), options?: ScrollIntoViewOptions, timeout?: number): Promise<any> | (() => void);
export function getScrollBoundaries(): HTMLElement[];
export function scopedScrollIntoView(_elem: HTMLElement | ((elem: HTMLElement) => HTMLElement), _boundary: scrollBoundary): Promise<void>;
export function scrollToContext(context: RenderContext): Promise<void>;
