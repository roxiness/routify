export function persistentScrollTo(
    el: HTMLElement,
    options: ScrollIntoViewOptions,
    timeout: number,
): Promise<any>

export function persistentScrollTo(
    el: HTMLElement,
    options: ScrollIntoViewOptions,
    timeout: undefined,
): () => void
