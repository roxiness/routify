<script>
    import { getContext } from 'svelte'
    export let node
    export let rootName = ''

    const nodeStore = getContext('node')

    function selectNode(event) {
        event.preventDefault()
        $nodeStore = node
    }
</script>

<strong href={node.path} class="node">
    {@html node.name || `<strong>[${node.rootName}]</strong>`}
    <a href="#" on:click={selectNode}>
        <span class="info"> i </span>
    </a>
</strong>

<ul>
    {#each node.children as childNode}
        <li>
            <svelte:self node={childNode} />
        </li>
    {/each}
</ul>
