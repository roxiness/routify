<script>
    export let node
    export let passthrough
</script>

{#await node.rawComponent then rawComponent}
    <svelte:component this={rawComponent} {...passthrough}>
        <slot />
    </svelte:component>
{/await}
