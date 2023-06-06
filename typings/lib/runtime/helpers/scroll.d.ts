export function persistentScopedScrollIntoView(_elem: HTMLElement | ((elem: HTMLElement) => HTMLElement), _boundary?: HTMLElement | ((elem: HTMLElement) => HTMLElement), options?: ScrollIntoViewOptions, timeout?: number): Promise<any> | (() => void);
export function observeDocument(callback: any, runOnInit: any, timeout: any): MutationObserver;
export function scrollIntoView(elem: HTMLElement, instant: boolean): void;
export function scrollToTop(elem: HTMLElement, boundary: HTMLElement): void;
export function scrollToContext(context: RenderContext): Promise<void>;
