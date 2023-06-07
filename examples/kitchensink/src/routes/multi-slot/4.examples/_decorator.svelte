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

        height: 100%;
        width: 100%;
        border: 2px solid blue;
    }
</style>
