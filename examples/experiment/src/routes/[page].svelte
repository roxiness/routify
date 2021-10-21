<script>
    import { node, params } from '@roxi/routify'
    import Nav from './_navigation.svelte'
    const pages = $node.traverse('../pages')
    $: index = pages.children.findIndex(page => page.name === $params.page)
</script>

<div class="app-wrapper" style="--page-index: {index}">
    <div id="app">
        {#each pages.children as page}
            <article class="page">
                <svelte:component this={page.traverse('./index').component} />
            </article>
        {/each}
    </div>
</div>

<Nav {pages} />

<style>
    :global(html),
    :global(body),
    .app-wrapper,
    #app {
        height: 100%;
    }
    .app-wrapper {
        overflow: hidden;
    }
    #app {
        display: flex;
        flex-direction: row;
        transform: translateX(calc(25% + -50% * var(--page-index)));
        transition: all 0.3s;
    }
    article {
        margin-left: 20px;
        margin-right: 20px;
        flex: 0 0 50%;
    }
</style>
