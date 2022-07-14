<script>
    import { onDestroy } from 'svelte'

    import DecoRender from './DecoRender.svelte'
    export let decorators = null
    export let context

    $: decoClones = [...(decorators || context.decorators)]
    $: lastDecorator = decoClones.pop()

    function Parent(options) {
        options.props = {
            ...options.props,
            decorators: [...decoClones],
            context,
        }
        return new DecoRender(options)
    }

    context.onDestroy = onDestroy
</script>

<svelte:component this={lastDecorator} {Parent} {context}>
    <slot />
</svelte:component>
