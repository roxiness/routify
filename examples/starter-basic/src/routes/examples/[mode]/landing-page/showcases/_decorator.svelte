<script>
    export let isRoot
    export let context
</script>

<div class="example">
    <slot />
</div>
<!-- set recursive to false to make sure the decorator is only applied to the immediate children -->

<!-- routify:meta recursive=false -->
<style>
    .example {
        flex: 0 0 auto;
        width: 100%;
        padding: 0 20px;
        position: relative;
        z-index: -1;
    }
    .example :global(svg) {
        width: 100%;
    }
    * :global(h3) {
        color: var(--text-2);
        position: absolute;
    }
</style>
