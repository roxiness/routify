<script>
    export let context
    console.log(context.node.parent.children.indexed[0])
</script>

index


{#each context.node.parent.children.indexed as node}
<div>
 {#await node.children.index.component() then cmp}
 <!-- {@debug cmp} -->
<svelte:component this={cmp.default} />
{/await}

</div>
{/each}