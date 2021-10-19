<script>
    import { url } from '@roxi/routify'
    export let node
</script>

<ul>
    {#each node.pages as page}
        <li>
            <a href={$url(page.path)}>{page.name}</a>
        </li>
    {/each}
</ul>
