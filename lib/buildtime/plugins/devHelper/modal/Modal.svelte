<script>
    import Content from './Content.svelte'
    let show = true
    const hide = () => (show = false)
    const reveal = () => (show = true)
</script>

<div class="modal">
    {#if show}
        <Content {hide} />
    {:else}
        <button on:click={reveal}>Routify Helper</button>
    {/if}
</div>

<style>
    .modal {
        position: fixed;
        bottom: 0;
        right: 0;
    }
</style>
