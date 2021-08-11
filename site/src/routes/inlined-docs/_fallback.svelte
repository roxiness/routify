<script>
    import { context } from '@roxi/routify'
    const isNotUnderscored = node => !node.file.base.startsWith('_')
</script>

<div class="inlined-layout">
    <div class="container">
        {#if true}
            {#each $context.node.parent.parent.children.docs.children as category}
                <h1>
                    {category.name}
                </h1>
                {#each category.children.filter(isNotUnderscored) as topic}
                    <div class="block">
                        <h2>
                            {topic.name}
                        </h2>
                        <svelte:component this={topic.component}>
                            {#each topic.children as subject}
                                <svelte:component this={subject.component} />
                            {/each}
                        </svelte:component>
                    </div>
                {/each}
            {/each}
        {/if}
    </div>
</div>

<style>
    .inlined-layout {
        /* display: ; */
    }
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
