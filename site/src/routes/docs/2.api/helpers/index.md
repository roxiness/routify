<script>
    export let context
    console.log(context.node.parent.children.indexed[0])
    import Cmp from './__Cmp.svelte'
</script>

index


{#each context.node.parent.children.indexed as node}
    <div>
        <Cmp node={node.children.index} />
        <!-- {#await node.children.index.component() then cmp}
        {@debug cmp}
            <svelte:component this={cmp.default} />
        {/await} -->

    </div>
{/each}