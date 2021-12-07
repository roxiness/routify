<script>
    import { Router, activeRoute } from '@roxi/routify'

    const { router } = $activeRoute
    const hasNestedRouter = router.name === 'nested'
    const rootNode = router.instance.nodeIndex.find(node => node.path === '/composition')
</script>

{#if !hasNestedRouter}
    <article>
        <Router name="rootnode" {rootNode} />
    </article>
{:else}
    <p>We could nest routers inifintely, but let's not...</p>
{/if}
