<script>
    import { getRoutifyFragmentContext, setRoutifyFragmentContext } from '../utils'
    export let node
    export let passthrough

    const context = { ...getRoutifyFragmentContext(), node }
    setRoutifyFragmentContext(context)

    let Component = node.module?.default
    if (!Component && node.asyncModule)
        node.asyncModule().then(r => (Component = r.default))
</script>

{#if Component}
    <svelte:component this={Component} {...passthrough} {context}>
        <slot />
    </svelte:component>
{:else}
    <slot />
{/if}
