<script>
    import AddressInput from './_addressInput.svelte'
    import Options from './_options.svelte'
    export let router
</script>

<div class="bar">
    <AddressInput {router} />
    <Options {router} />
</div>
<slot {router} />

<style>
    .bar {
        position: relative;
    }
</style>
