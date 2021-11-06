<script>
    import { node } from '@roxi/routify'
    export let pages
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
        {#each $node.pages as page}
            <li>
                <a href="/{page.name}">{page.name}</a>
            </li>
        {/each}
    </ul>
</nav>

<style>
    .container {
        padding: 0 80px;
    }
</style>
