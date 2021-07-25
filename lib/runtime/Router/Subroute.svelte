<script>
    import Component from './Component.svelte'
    export let activeRoute

    $: fragments =
        $activeRoute && $activeRoute.fragments.filter(fragment => fragment.node.component)
</script>

{#if $activeRoute}
    <Component {fragments} />
{/if}
