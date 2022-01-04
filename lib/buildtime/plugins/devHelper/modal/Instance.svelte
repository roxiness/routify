<script>
    import Node from './Node.svelte'
    export let instance

    console.log(instance)
</script>

<ul>
    {#each Object.entries(instance.rootNodes) as [rootNodeName, rootNode]}
        <li>
            <b>
                {rootNodeName}
            </b>
            <Node node={rootNode} />
        </li>
    {/each}
</ul>
