<script>
    import Component from './Component.svelte'
    export let router
    /** todo should be destructured from router
     * but that's not currently possible
     * because of a bug in Svelte */
    export let activeRoute

    $: fragments =
        $activeRoute && $activeRoute.fragments.filter(fragment => fragment.node.component)
</script>

{#if $activeRoute}
    <Component route={$activeRoute} {fragments} />
{/if}
