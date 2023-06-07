<script>
    import { url, isActive, context } from '@roxi/routify'
    /**
     * $context is the router context.
     * $context.node is the current node.
     * $context.node.pages is the current node's children.
     * $url creates an URL from a node path.
     * $isActive checks if a node is part of the current URL.
     **/
</script>

<ul>
    <!-- iterates over each child page -->
    {#each $context.node.pages as childNode}
        <!-- if the child is active adds the isActive class -->
        <li class:isActive={$isActive(childNode.path)}>
            <a href={$url(childNode.path)}>
                <!-- if the child has a meta name, use it, otherwise use the filename -->
                {childNode.meta.name || childNode.name}
            </a>
        </li>
    {/each}
</ul>
