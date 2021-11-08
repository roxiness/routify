<script>
    import { isActive, node } from '@roxi/routify'
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
        {#each $node.pages as childNode, index}
            <li class:isActive={$isActive(childNode.path)}>                
                <a href={liveUrl(index) || childNode.path}
                    >{childNode.meta.title || childNode.name}</a>
            </li>
        {/each}
    </ul>
</nav>

<style>
    .container {
        padding: 0 40px;
    }
    .isActive a {text-decoration: underline;}
</style>
