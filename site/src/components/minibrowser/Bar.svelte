<script>
    import AddressInput from './AddressInput.svelte'
    import Options from './Options.svelte'
    export let router = null
    export let context = null
    // if we're using MiniBrowser as a decorator, we only get context
    $: router = router || context?.route?.router
</script>

{#if router}
    <div class="bar">
        <AddressInput activeRoute={router.activeRoute} />
        <Options {router} />
    </div>
{/if}
<slot />

<style>
    .bar {
        position: relative;
    }
</style>
