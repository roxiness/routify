<script>
    import { getContext, setContext } from 'svelte'
    export let node
    export let passthrough
    const CTX = 'routify-fragment-context'

    const context = { ...getContext(CTX), node }
    setContext(CTX, context)

    let Component = node.module?.default
    if (!Component && node.asyncModule)
        node.asyncModule().then(r => (Component = r.default))
</script>

{#if Component}
    <Component {...passthrough} {context}>
        <slot />
    </Component>
{:else}
    <slot />
{/if}
