<script>
    import { getContext, setContext } from 'svelte'
    export let node
    const context = getContext('routify-fragment-context')
    context.node = node
    setContext('routify-fragment-context', context)
    $: console.log('nc', node.module)
    // TODO node.module should not change chape
    // should maybe be getter
    /**
     * it should be
     * node = {
     *   module: async () => {
     *     if(!this.cachedComponent)
     *       this.cachedComponent = await
     *   }
     *   cachedComponent:
     *   componentImport: <old module import>
     * }
     */
</script>

{#await node.module() then cmp}
    <svelte:component this={cmp.default} {context} />
{/await}
