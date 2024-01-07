export type TransitionConfig = {
    axis: 'x' | 'y';
    default: TransitionCallback;
    next: TransitionCallback;
    prev: TransitionCallback;
    higher: TransitionCallback;
    lower: TransitionCallback;
    same: TransitionCallback;
    first: TransitionCallback;
    last: TransitionCallback;
};
export type TransitionCallback = (ctx: TransitionCallbackCtx) => Transition;
export type TransitionCallbackCtx = {
    wrapper: HTMLElement;
    rect: DOMRect;
    config: TransitionConfig;
};
export type Transition = {
    transitionIn: import('svelte/transition').TransitionConfig;
    transitionOut: import('svelte/transition').TransitionConfig;
    inParams: any;
    outParams: any;
};
