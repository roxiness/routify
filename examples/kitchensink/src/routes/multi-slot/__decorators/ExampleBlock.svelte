<script>
    export let context
</script>

<div class="{context.node.id} {context.node.hasComponent}">
    {context.node.id}
    <slot />
</div>

<style>
    div {
        border: 4px solid green;
        min-height: 540px;
    }
</style>
