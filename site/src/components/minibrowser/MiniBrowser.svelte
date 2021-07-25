<script>
    import AddressInput from './AddressInput.svelte'
    import Options from './Options.svelte'
    export let context
    const { router } = context.route
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
