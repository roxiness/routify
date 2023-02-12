<script>
    export let context
</script>

<div>
    routes{context.node.path}.md
    <slot />
</div>

<style>
    div {
        border: 4px solid green;
        min-height: 100vh;
        padding-inline: 5px;
        padding-top: 65px;
    }
</style>
