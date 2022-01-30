<script>
    import { context } from '@roxi/routify'
    const { node, route } = $context
    const index = route.fragments.findIndex(fragment => fragment.node === node)
</script>

<div class="decorator" style="--index:{index}">
    <caption> {$context.node.name || 'unnamed'} </caption>
    <slot />
</div>

<style>
    div {
        background: repeating-linear-gradient(
            calc(var(--index) * 22.5deg),
            rgba(0, 0, 0, 0.05),
            rgba(0, 0, 0, 0.05) 10px,
            rgba(255, 255, 255, 0.05) 10px,
            rgba(255, 255, 255, 0.05) 20px
        );
        outline: 1px #ccc solid;
    }
    caption {
        background: rgba(255 255 255 / 0.8);
        line-height: 1;
        padding: 0 2px;
        color: black;
    }
</style>
