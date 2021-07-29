<script>
    export let context
    console.log(context.node.parent.children.indexed[0])
</script>

index


{#each context.node.parent.children.indexed as node}
    <div>
        <svelte:component this={node.children.index.component} />
    </div>
{/each}