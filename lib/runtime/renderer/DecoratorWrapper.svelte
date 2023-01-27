<!-- Looping decorator wrapper. The Parent prop returns a new decorator wrapper with the next decorator -->
<script>
    import { onDestroy } from 'svelte'

    export let decorators = null
    export let isRoot = true
    export let context
    decorators = decorators || context.decorators
    let [decorator, ...restOfDecorators] = [...decorators]
    while (decorator && !decorator?.shouldRender({ context, isRoot, decorators }))
        [decorator, ...restOfDecorators] = [...restOfDecorators]

    // we only want to trigger onDestroy from the first decorator wrapper
    if (isRoot) onDestroy(() => context.onDestroy.run())
</script>

{#if decorator}
    <svelte:component this={decorator.component} {context} {isRoot}>
        <svelte:self decorators={restOfDecorators} {context} isRoot={false}>
            <slot />
        </svelte:self>
    </svelte:component>
{:else}
    <slot />
{/if}
