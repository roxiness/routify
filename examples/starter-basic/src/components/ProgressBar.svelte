<script>
    export let router
    const { pendingRoute } = router
</script>

{#if $pendingRoute}
    <div class="progress-line" />
{/if}
