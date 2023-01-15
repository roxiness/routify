<!-- Looping decorator wrapper. The Parent prop returns a new decorator wrapper with the next decorator -->
<script>
    import { onDestroy } from 'svelte'

    export let decorators = null
    export let root = false
    export let context
    export let isNoop = false
    decorators = decorators || context.decorators
    const [Decorator, ...restOfDecorators] = [...decorators]

    // we only want to trigger onDestroy from the first decorator wrapper
    if (root) onDestroy(() => context.onDestroy.run())
</script>

{#if Decorator && !isNoop}
    <svelte:component this={Decorator} {context}>
        <svelte:self decorators={restOfDecorators} {context}>
            <slot />
        </svelte:self>
    </svelte:component>
{:else}
    <slot />
{/if}
