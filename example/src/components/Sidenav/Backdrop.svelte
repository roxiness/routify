<script>
    export let show = false
    $: showClass = show ? 'show' : ''
    const handleClick = () => {
        if (show) show = false
    }
</script>

<div class="backdrop {showClass}" on:click={handleClick} />

<style>
    .backdrop {
        background: rgb(0, 0, 0);
        opacity: 0;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
        transition: all 0.3s;
    }
    .backdrop.show {
        opacity: 0.1;
        pointer-events: all;
    }
</style>
