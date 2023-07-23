<script>
    export let context
</script>

<div class="inline-decorator {context.node.id}">
    <slot />
</div>

<style>
    .inline-decorator {
        padding-block: 3vw;
        scroll-margin-top: var(--nav-height);
        min-height: calc(var(--frame-inner-height) - var(--nav-height));
    }
    :global(.frame-wrapper) .inline-decorator {
        scroll-margin-top: calc(var(--nav-height) / var(--ratio));
    }
</style>
