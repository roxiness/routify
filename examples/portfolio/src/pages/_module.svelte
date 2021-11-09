<script>
    import { InlineNav } from '@roxi/routify/lib/components/index'
    import Navigation from './_navigation.svelte'
    import Loader from './_loader.svelte'
</script>

<Loader />
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
        padding: 0 40px;
    }
    .page {
        flex: 0 0 100%;
        margin-right: 80px;
        max-height: calc(100vh - 100px);
        overflow-y: auto;
    }
</style>
