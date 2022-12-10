<script>
    export let context

    const { isActive } = context

    let depth = 1
    let _ctx = context.parentContext
    while ((_ctx = _ctx?.parentContext)) depth++
    $: degree = 90 + depth * 22.5
</script>

<div
    class="fragment {$isActive ? 'active' : 'inactive'} {context.node.id}"
    style="--degree: {degree}deg">
    <caption> {context.node.id || 'unnamed'} </caption>
    <slot />
</div>

<style>
    .fragment.active {
        background: repeating-linear-gradient(
            var(--degree),
            #efe,
            #efe 10px,
            #fff 10px,
            #fff 20px
        );
        border: 1px solid green;
    }
    .fragment.inactive {
        opacity: 0.5;
        background: repeating-linear-gradient(
            var(--degree),
            #fee,
            #fee 10px,
            #fff 10px,
            #fff 20px
        );
        border: 1px solid rgba(255 0 0 / 0.5);
    }
    caption {
        background: rgba(0 0 0 / 0.5);
        line-height: 1;
        padding: 0 2px;
        font-weight: semi-bold;
        color: rgba(255 255 255 / 0.8);
    }
</style>
