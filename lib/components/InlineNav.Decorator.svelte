<script>
    import InlineNav from './InlineNav.svelte'
    import Noop from '../runtime/decorators/Noop.svelte'
    export let context
    export let Template = Noop
    const rootNode = context.route.fragments.slice(-2, 1)[0].node
</script>

{#if typeof window !== 'undefined'}
    <InlineNav let:pages {rootNode}>
        {#each pages as { Page }}
            <Template>
                <Page />
            </Template>
        {/each}
    </InlineNav>
{:else}
    <Template>
        <slot />
    </Template>
{/if}
