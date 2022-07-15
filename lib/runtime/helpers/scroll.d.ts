export function PersistentScrollTo(
    el: HTMLElement,
    options: ScrollIntoViewOptions,
    timeout: number,
): Promise<any>

export function PersistentScrollTo(
    el: HTMLElement,
    options: ScrollIntoViewOptions,
    timeout: undefined,
): () => void
