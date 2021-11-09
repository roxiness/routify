<script>
    import { pendingRoute } from '@roxi/routify'
    $: value = $pendingRoute && 0
    setInterval(() => {
        value++
    }, 1000 / 120)
</script>

{#if $pendingRoute}
    <progress {value} max="100" />
{/if}

<style>
    progress {
        position: fixed;
    }
</style>
