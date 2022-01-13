<script>
    import Node from './Node.svelte'
    export let instance

    console.log(instance)
</script>

<ul>
    {#each Object.values(instance.rootNodes) as rootNode}
        <li>
            <Node node={rootNode} />
        </li>
    {/each}
</ul>
