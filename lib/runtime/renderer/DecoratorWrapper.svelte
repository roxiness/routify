<!-- Looping decorator wrapper. The Parent prop returns a new decorator wrapper with the next decorator -->
<script>
    import { onDestroy } from 'svelte'
    import Noop from '../decorators/Noop.svelte'

    export let decorators = null
    export let isRoot = true
    export let context
    decorators = decorators || context.decorators

    const sortedDecorators = [...decorators].sort(
        (a, b) => (a.order || 0) - (b.order || 0),
    )

    // sveltejs+vite-plugin-svelte won't let us do spread operators
    let decorator = sortedDecorators[0]
    let restOfDecorators = sortedDecorators.slice(1)

    while (decorator && !decorator?.shouldRender({ context, isRoot, decorators }))
        [decorator, ...restOfDecorators] = [...restOfDecorators]

    // we only want to trigger onDestroy from the first decorator wrapper
    if (isRoot) onDestroy(() => context.onDestroy.run())
</script>

<!-- we can't have a root if-condition as that breaks transitions with local directives -->

<svelte:component
    this={decorator ? decorator.component : Noop}
    {context}
    {isRoot}
    {...decorator?.props}>
    {#if restOfDecorators.length}
        <svelte:self decorators={restOfDecorators} {context} isRoot={false}>
            <slot />
        </svelte:self>
    {:else}
        <slot />
    {/if}
</svelte:component>
