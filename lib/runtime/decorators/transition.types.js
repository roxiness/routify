/**
 * @typedef {Object} TransitionConfig
 * @property {'x'|'y'} axis
 * @property {TransitionCallback} default
 * @property {TransitionCallback} next
 * @property {TransitionCallback} prev
 * @property {TransitionCallback} higher
 * @property {TransitionCallback} lower
 * @property {TransitionCallback} same
 * @property {TransitionCallback} first
 * @property {TransitionCallback} last
 */

/**
 * @callback TransitionCallback
 * @param {TransitionCallbackCtx} ctx
 * @returns {Transition}
 */

/**
 * @typedef {Object} TransitionCallbackCtx
 * @property {HTMLElement} wrapper
 * @property {DOMRect} rect
 * @property {TransitionConfig} config
 *
 */

/**
 * @typedef {Object} Transition
 * @property {import('svelte/transition').TransitionConfig} transitionIn
 * @property {import('svelte/transition').TransitionConfig} transitionOut
 * @property {Object} inParams
 * @property {Object} outParams
 *
 **/

export {}

// import type { TransitionConfig as SvelteTransitionConfig } from 'svelte/transition'

// export interface TransitionCallbackCtx {
//     wrapper: HTMLElement
//     rect: DOMRect
//     config: TransitionConfig
// }

// export interface Transition {
//     transitionIn: SvelteTransitionConfig
//     transitionOut: SvelteTransitionConfig
//     inParams: Record<string, any>
//     outParams: Record<string, any>
// }

// export type TransitionCallback = (ctx: TransitionCallbackCtx) => Transition

// export interface TransitionConfig {
//     axis: 'x' | 'y'
//     default: TransitionCallback
//     next: TransitionCallback
//     prev: TransitionCallback
//     higher: TransitionCallback
//     lower: TransitionCallback
//     same: TransitionCallback
//     first: TransitionCallback
//     last: TransitionCallback
// }
