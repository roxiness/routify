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

<style>
    a {
        text-decoration: none;
        color: var(--color-grey-400);
        font-weight: 500;
    }
    a:hover {
        color: var(--color-grey-500);
    }
    ul {
        padding-left: var(--size-2);
    }
    .node {
        height: 24px;
        width: 100%;
        display: inline-block;
    }
    .info {
        background: var(--color-grey-400);
        border-radius: var(--radius-full);
        width: 13px;
        line-height: 13px;
        text-align: center;
        color: white;
        display: inline-block;
        font-weight: 700;
        font-size: 12px;
    }
    .node:not(:hover) span.info {
        /* display: none; */
    }
</style>
