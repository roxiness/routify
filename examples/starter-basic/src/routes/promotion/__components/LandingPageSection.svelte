<script>
    export let context
    const hash = Math.random().toString(36).substring(2)
    console.log('hash', hash)
</script>

<div class="wtf {context.node.id} {hash}">
    <slot />
</div>

<style>
    div {
        min-height: 100vh;
        scroll-margin-top: 92px;
    }
</style>
