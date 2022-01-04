<script>
    import Content from './Content.svelte'
    let show = true
    const hide = () => (show = false)
</script>

<div class="modal">
    {#if show}
        <Content {hide} />
    {:else}
        <button>Routify Helper</button>
    {/if}
</div>

<style>
    .modal {
        position: fixed;
        bottom: 0;
        right: 0;
    }
</style>
