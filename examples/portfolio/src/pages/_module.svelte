<script>
    import { InlineNav } from '@roxi/routify/lib/components/index'
    import Navigation from './_navigation.svelte'
</script>

<InlineNav let:pages let:index>
    <Navigation {pages} />
    <div class="container" style="--page-index: {index}">
        {#each pages as { Page, router }}
            <div
                class="page"
                on:click={history.pushState(null, null, router.url.external())}>
                <Page />
            </div>
        {/each}
    </div>
</InlineNav>

<style>
    :global(*) {
        max-height: 100%;
    }
    :global(html),
    :global(body) {
        overflow: hidden;
    }
    .container {
        transition: transform 0.3s;
        transform: translateX(calc(-100% * var(--page-index)));
        display: flex;
        padding: 0 80px;
    }
    .page {
        flex: 0 0 100%;
        margin-right: 160px;
        max-height: calc(100vh - 200px);
        overflow-y: auto;
    }
</style>
