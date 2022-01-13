<script>
    import Content from './Content.svelte'

    let show = JSON.parse(localStorage.getItem('show-routify-devHelper'))
    const hide = () => setShow(false)
    const reveal = () => setShow(true)
    const setShow = value => {
        show = value
        localStorage.setItem('show-routify-devHelper', value)
    }
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
