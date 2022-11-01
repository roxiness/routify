<script>
    import { isActive, node } from '@roxi/routify'
    export let pages = undefined
    $: liveUrl = index => pages?.[index]?.router?.url.external()
</script>

<header class="fixed responsive grey3">
    <nav>
        <h5>
            <a href="/">Kitchensink</a>
        </h5>
        <div class="max" />

        {#each $node.pages as childNode, index}
            <a
                class="button  {$isActive(childNode.path) ? 'border' : 'transparent'}"
                href={liveUrl(index) || childNode.path}
                >{childNode.meta.title || childNode.name}</a>
        {/each}
    </nav>
</header>

<style>
    .isActive {
        text-decoration: underline;
    }
</style>
