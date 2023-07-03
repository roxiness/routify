<script>
    export let context
</script>

<div class="inline-decorator {context.node.id}">
    <slot />
</div>

<style>
    .inline-decorator {
        --offset: calc(var(--nav-height) + 16px);

        padding-top: calc(var(--offset));
        min-height: 100vh;
    }
    :global(.frame-wrapper) div {
        min-height: var(--offset);
    }
</style>
