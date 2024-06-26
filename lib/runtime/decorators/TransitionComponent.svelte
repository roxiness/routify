<script>
    import { fade, fly, scale } from 'svelte/transition'
    import { getDirection } from '../helpers'

    /** @type {RenderContext} */
    export let context

    /** @type {Partial<import('./transition.types.js').TransitionConfig>} */
    export let config = {}

    let wrapper = globalThis.document?.body
    let _inTransition
    let _outTransition
    let _inTransitionParams
    let _outTransitionParams

    const defaultTransitionCallback = ctx => ({
        transitionIn: fade,
        transitionOut: fade,
        inParams: { duration: 500 },
        outParams: { duration: 500 },
    })

    const defaultConfig = {
        axis: context?.allProps?.axis || 'x',
        default: defaultTransitionCallback,
        next: ctx => ({
            transitionIn: fly,
            transitionOut: fly,
            inParams: { [ctx.axis]: ctx.rect.height, duration: 500 },
            outParams: { [ctx.axis]: -ctx.rect.height, duration: 500 },
        }),
        prev: ctx => {
            return {
                transitionIn: fly,
                transitionOut: fly,
                inParams: { [ctx.axis]: -ctx.rect.height, duration: 500 },
                outParams: { [ctx.axis]: ctx.rect.height, duration: 500 },
            }
        },
        higher: ctx => ({
            transitionIn: scale,
            transitionOut: scale,
            inParams: { start: 1.2 },
            outParams: { start: 0.8 },
        }),
        lower: ctx => ({
            transitionIn: scale,
            transitionOut: scale,
            inParams: { start: 0.8 },
            outParams: { start: 1.2 },
        }),
        same: defaultTransitionCallback,
        first: defaultTransitionCallback,
        last: defaultTransitionCallback,
        na: defaultTransitionCallback,
    }

    const setParams = direction => {
        const _config = { ...defaultConfig, ...config }
        const paramCallback = _config[direction]
        const rect = wrapper.getBoundingClientRect()
        const directionParams = paramCallback({ ..._config, wrapper, rect })
        _inTransition = directionParams.transitionIn
        _outTransition = directionParams.transitionOut
        _inTransitionParams = directionParams.inParams
        _outTransitionParams = directionParams.outParams
    }

    $: setParams($getDirection)
</script>

<!-- routify:meta recursive=false -->
<!-- routify:meta order=-1 -->

<div
    class="routify_transition"
    bind:this={wrapper}
    in:_inTransition|local={_inTransitionParams}
    out:_outTransition|local={_outTransitionParams}>
    <slot />
</div>

<style>
    .routify_transition {
        grid-row: 1;
        grid-column: 1;
        display: grid;
        width: 100%;
        height: 100%;
    }
</style>
