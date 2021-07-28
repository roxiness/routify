<script>
    import { getContext, setContext } from 'svelte'
    export let node
    const context = getContext('routify-fragment-context')
    context.node = node
    setContext('routify-fragment-context', context)
    $: console.log('nc', node.component)
    // TODO node.component should not change chape
    // should maybe be getter
    /**
     * it should be
     * node = {
     *   component: async () => {
     *     if(!this.cachedComponent)
     *       this.cachedComponent = await
     *   }
     *   cachedComponent:
     *   componentImport: <old component import>
     * }
     */
</script>

{#await node.component() then cmp}
    <svelte:component this={cmp.default} {context} />
{/await}
