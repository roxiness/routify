<script>
    import { url } from '@roxi/routify'
    export let node
</script>

<ul>
    {#each node.pages as page}
        <li>
            <a href={$url(page.path)}>{page.name}</a>
            {#if page.pages.length}
                <svelte:self node={page} />
            {/if}
        </li>
    {/each}
</ul>
