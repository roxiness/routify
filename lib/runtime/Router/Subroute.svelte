<script>
    import Component from './Component.svelte'
    export let router
    $: ({ activeRoute } = router)
    $: fragments =
        $activeRoute && $activeRoute.fragments.filter(fragment => fragment.node.component)
</script>

{#if $activeRoute}
    <Component route={$activeRoute} {fragments} />
{/if}
