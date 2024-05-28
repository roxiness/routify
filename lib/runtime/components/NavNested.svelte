<script>
    import { url, isActive, node as _node } from '@roxi/routify'
    export let node = $_node
    export let depth = 1000

    /**
     * Basic unstyled nested navigation / sitemap. Feel free to style it as you wish.
     *
     * $node is the current node.
     * $node.pages is the current node's children.
     * $url creates an URL from a node path.
     * $isActive checks if a node is part of the current URL.
     **/
</script>

<ul>
    <!-- iterates over each child page -->
    {#each node.linkableChildren as childNode}
        <!-- if the child is active, adds the isActive class -->
        <li class:isActive={$isActive(childNode.path)}>
            <a href={$url(childNode.path)}>
                <!-- title can be overwritten using `meta.title` -->
                {childNode.title}
            </a>
            {#if childNode.linkableChildren.length > 0 && depth > 1}
                <svelte:self node={childNode} depth={depth - 1} />
            {/if}
        </li>
    {/each}
</ul>
