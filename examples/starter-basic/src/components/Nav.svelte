<script>
    import { url, isActive } from '@roxi/routify'

    /** @type {RNodeRuntime} */
    export let node
</script>

<ul>
    {#each node.pages as childNode}
        <li class:isActive={$isActive(childNode.path)}>
            <a href={$url(childNode.path)}>
                {childNode.meta.name || childNode.name}
            </a>
        </li>
    {/each}
</ul>
