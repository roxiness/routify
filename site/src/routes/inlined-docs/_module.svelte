<script>
    import { context } from '@roxi/routify'
    const pages = []
    const addPages = node =>
        node.children
            .filter(node => node.name !== 'example')
            // .filter(node => !node.file.base.startsWith('_'))
            // .filter(node => node.component)
            // .filter(node => node.module)
            .forEach(child => {
                if (child.module && !child.file.base.startsWith('_')) pages.push(child)
                addPages(child)
            })

    addPages($context.node.parent.children.docs)
    console.log({ pages })
</script>

{#if true}
    <div class="container">
        {#each pages as page}
            <div class="block">
                <svelte:component this={page.component} />
            </div>
        {/each}
    </div>
{/if}

<style>
    .block {
        display: inline-block; /* prevent collapsing margins */
        width: 100%;
        min-height: 400px;
        background: #f4f7f9;
        margin-top: var(--spacing-4);
        border-radius: var(--spacing-5);
        padding: var(--spacing-7) var(--spacing-8) var(--spacing-8);
    }
</style>
