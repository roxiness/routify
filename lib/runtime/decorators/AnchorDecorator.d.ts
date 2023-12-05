export type Location =
    | 'wrapper'
    | 'header'
    | 'parent'
    | 'firstChild'
    | ((elem: HTMLElement) => HTMLElement)
