<script>
    import { context } from '@roxi/routify'
    import { LiveAnchor, Anchor } from 'polykit'
    import { activeHash } from './stores'

    const noExample = node => node.name !== 'example'
    const noInternal = node => node.name !== 'internal'

    const { isScrolling } = $context.route.router.scrollHandler

    $: if (!$isScrolling)
        history.replaceStateNative({}, null, `/inlined-docs/#${$activeHash}`)
</script>

<LiveAnchor bind:activeHash={$activeHash} let:anchors>
    <div class="inlined-layout">
        {#if true}
            {#each $context.node.parent.parent.children.docs.children.indexed.filter(noInternal) as category}
                <div class="section">
                    <!-- <div id={category.name} use:addAnchor /> -->
                    <h1 class="section-header" id={category.name} use:anchors.push>
                        {category.name}
                    </h1>

                    {#if category.children.index}
                        <svelte:component this={category.children.index.component} />
                    {/if}

                    {#each category.children.indexed as topic}
                        <Anchor id="{category.name}/{topic.name}" />
                        <!-- <div id="{category.name}/{topic.name}" use:addAnchor /> -->
                        <h2 class="category-header">
                            {topic.name}
                        </h2>
                        <div class="block">
                            <!-- {JSON.stringify(topic)} -->
                            <svelte:component this={topic.component}>
                                {#each topic.children as subject}
                                    <Anchor
                                        id="{category.name}/{topic.name}/{subject.name}" />
                                    <!-- <div
                                    id="{category.name}/{topic.name}/{subject.name}"
                                    use:addAnchor /> -->
                                    <div class="subject">
                                        <svelte:component this={subject.component}>
                                            {#each subject.children.filter(noExample) as entry}
                                                <svelte:component
                                                    this={entry.component} />
                                            {/each}
                                        </svelte:component>
                                    </div>
                                {/each}
                            </svelte:component>
                        </div>
                    {/each}
                </div>
            {/each}
        {/if}
    </div>
</LiveAnchor>

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
    .section-header {
        font-size: 96px;
        margin-top: 96px;
        padding-left: 96px;
        text-transform: uppercase;
        font-weight: bold;
        border-bottom: 4px solid #606c76;
    }
    .category-header {
        font-size: 48px;
        padding-left: 96px;
        text-transform: capitalize;
        margin-top: 128px;
        font-weight: bold;
    }
    .subject:not(:first-child) {
        margin-top: 48px;
        padding-top: 48px;
        border-top: 2px solid #e5e5e5;
    }
</style>
