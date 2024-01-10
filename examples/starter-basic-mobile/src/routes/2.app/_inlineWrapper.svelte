<script>
    export let context
</script>

<!-- _inlineWrapper.svelte files are automatically used as wrappers
    for inlined pages in the respective folder. -->

<section class={context.node.name}>
    <slot />
</section>

<style>
    section {
        padding: 32px clamp(8px, 3vw, 32px);
        margin: 0;
        height: 100%;
        overflow: auto;
    }
    section.home {
        background: rgba(0, 255, 255, 0.1);
    }
    section.explore {
        background: rgba(255, 0, 255, 0.1);
    }
    section.guide {
        background: rgba(255, 255, 0, 0.1);
    }
</style>
