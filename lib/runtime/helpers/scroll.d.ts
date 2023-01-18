export function persistentScopedScrollIntoView(
    elem: HTMLElement | ((elem: HTMLElement) => HTMLElement),
    boundary: HTMLElement | ((elem: HTMLElement) => HTMLElement),
    options: ScrollIntoViewOptions,
    timeout: number,
): Promise<any>

export function persistentScopedScrollIntoView(
    elem: HTMLElement | ((elem: HTMLElement) => HTMLElement),
    boundary?: HTMLElement | ((elem: HTMLElement) => HTMLElement),
    options?: ScrollIntoViewOptions,
): () => void

export function scrollToContext(context: RenderContext): Promise<void>
