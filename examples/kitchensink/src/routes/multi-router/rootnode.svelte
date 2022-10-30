<script>
    import { Router, activeRoute, createRouter } from '@roxi/routify'

    const hasNestedRouter = $activeRoute.router.name === 'nested'
    const rootNode = $activeRoute.router.instance.nodeIndex.find(
        node => node.path === '/composition',
    )

    const router = createRouter({ name: 'rootnode', rootNode })
</script>

{#if !hasNestedRouter}
    <article>
        <Router {router} />
    </article>
{:else}
    <p>We could nest routers inifintely, but let's not...</p>
{/if}
