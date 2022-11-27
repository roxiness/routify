<!-- Looping decorator wrapper. The Parent prop returns a new decorator wrapper with the next decorator -->
<script>
    import { onDestroy } from 'svelte'
    import { addPropsToComp } from '../../common/utils.js'
    import DecoratorWrapper from './DecoratorWrapper.svelte'

    export let decorators = null,
        nested = false,
        context

    // TODO insert Noop.svelte as first item
    $: decoClones = [...(decorators || context.decorators)]
    $: lastDecorator = decoClones.pop()

    $: Parent = addPropsToComp(DecoratorWrapper, {
        decorators: decoClones,
        context,
        nested: true,
    })

    // we only want to trigger onDestroy from the first decorator wrapper
    if (!nested) onDestroy(() => context.onDestroy.run())
</script>

<svelte:component this={lastDecorator} {Parent} {context}>
    <slot />
</svelte:component>
