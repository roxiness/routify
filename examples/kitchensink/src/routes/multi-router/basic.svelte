<script>
    import { Router, activeRoute } from '@roxi/routify'

    const hasNestedRouter = $activeRoute.router.name === 'nested'
</script>

{#if !hasNestedRouter}
    <article>
        <Router name="nested" />
    </article>
{:else}
    <p>We could nest routers inifintely, but let's not...</p>
{/if}
