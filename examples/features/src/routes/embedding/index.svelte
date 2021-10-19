<script>
    export let context
</script>

<article>
    <svelte:component this={context.node.traverse('../../page').component} />
</article>
