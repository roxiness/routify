<script>
    import AddressInput from './_addressInput.svelte'
    import Options from './_options.svelte'
    export let router
    const { activeUrl } = router
</script>

<div class="bar">
    <AddressInput {activeUrl} />
    <Options {router} />
</div>
<slot {router} />

<style>
    .bar {
        position: relative;
    }
</style>
