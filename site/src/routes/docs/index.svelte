<script>
    import { context } from '@roxi/routify'
    import { LiveAnchor, Anchor } from 'polykit'
    import { activeHash } from './stores'

    const noExample = node => !node.name.match(/^example\.?/)
    const noInternal = node => node.name !== 'internal'

    const { isScrolling } = $context.route.router.scrollHandler

    // todo could be cleaner - possibly if(hasScrolled && !$isScrolling)
    let ready
    setTimeout(() => (ready = true), 0)

    $: if (ready && !$isScrolling)
        history.replaceStateNative({}, null, `/docs/#${$activeHash}`)
</script>

<LiveAnchor
    bind:activeHash={$activeHash}
    let:anchors
    offset={96 + 72}
    anchorOffset="-{96 + 72}px">
    <div class="copy">
        {#if true}
            {#each $context.node.parent.children.pages.children.indexed.filter(noInternal) as category}
                <div class="section">
                    <h1 class="section-hero">
                        <a href="#{category.name}">
                            <Anchor id={category.name} />
                            {category.name}
                        </a>
                    </h1>

                    {#if category.children.index}
                        <svelte:component this={category.children.index.component} />
                    {/if}

                    <div class="categories">
                        {#each category.children.indexed as topic}
                            <div class="category">
                                <h2 class="category-header">
                                    <Anchor id="{category.name}/{topic.name}" />
                                    <a href="#{category.name}/{topic.name}">
                                        {topic.name}
                                    </a>
                                </h2>
                                <div class="block">
                                    <svelte:component this={topic.component}>
                                        {#each topic.children.filter(noExample) as subject}
                                            {#if subject.name !== 'index'}
                                                <h3 class="subject-header">
                                                    <Anchor
                                                        id="{category.name}/{topic.name}/{subject.name}" />
                                                    <a
                                                        href="#{category.name}/{topic.name}/{subject.name}">
                                                        {subject.name}
                                                    </a>
                                                </h3>
                                            {/if}
                                            <svelte:component this={subject.component}>
                                                {#each subject.children.filter(noExample) as entry}
                                                    <svelte:component
                                                        this={entry.component} />
                                                {/each}
                                            </svelte:component>
                                        {/each}
                                    </svelte:component>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</LiveAnchor>

<style>
    .copy {
        margin: 0 var(--spacing-8);
    }
    .block {
        min-height: 256px;
        border-radius: var(--spacing-5);
    }
    .section {
        margin-top: 50vh;
    }
    .section:first-of-type {
        margin-top: 0;
    }
    .section-hero {
        margin: 0 calc(var(--spacing-8) * -1);
        padding-left: 96px;
        text-transform: uppercase;
        font-weight: bold;
        border-bottom: 8px solid #606c76;
    }
    .category:not(:first-of-type) .category-header {
        border-top: 4px solid var(--color-grey-300);
        padding: 4rem 0;
    }
    .category-header {
        text-transform: capitalize;
        font-weight: bold;
    }
    .subject-header {
        text-transform: capitalize;
        font-weight: bold;
    }
    a:visited {
        color: inherit;
    }
</style>
