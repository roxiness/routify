<script>
    import { node } from '@roxi/routify'
    export let pages
    $: liveUrl = index => pages && pages[index]?.router?.url.external()
</script>

<nav class="container">
    <ul>
        <li>
            <h1>
                <a href="/">Portfolio</a>
            </h1>
        </li>
    </ul>
    <ul>
        {#each $node.pages as page, index}
            <li>
                <a href={liveUrl(index) || page.path}>{page.name}</a>
            </li>
        {/each}
    </ul>
</nav>

<style>
    .container {
        padding: 0 80px;
    }
</style>
