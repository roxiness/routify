<script>
    import { url } from '@roxi/routify'
    import Icons from './icons.svelte'

    /** @type {RenderContext}*/
    export let context

    let isWideCard = false

    $: ({ isActive, route, node } = context)
    $: path = route?.leaf.node.path || node.path

    $: if (!$isActive) isWideCard = false
</script>

<!-- set recursive to false to make sure the decorator is only applied to the immediate children -->

<!-- routify:meta recursive=false -->
<div
    class="example node-{context.node.name}"
    class:active={$isActive}
    class:wide={isWideCard}>
    <div class="frame-wrapper">
        <div class="frame">
            <slot />
        </div>
        <div class="utils">
            <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
            <span aria-controls="widescreen" on:click={() => (isWideCard = !isWideCard)}>
                <Icons icon="aspect-ratio" />
            </span>
            <a
                href={$url('$leaf', { mode: 'full' })}
                data-routify-route-state-dontSmoothScroll="true">
                <Icons icon="fullscreen" />
            </a>
        </div>
    </div>
    <div class="body">
        <h1>{context.node.name}</h1>
        <p>
            {@html context.node.meta._description}
        </p>
    </div>
    <a href={$url(path, route?.params)} class="fade-overlay-link">
        <div class="fade-overlay" />
    </a>
</div>

<!-- TODO create a component that scales (transform:scale) to the dimensions of the parent element -->
<style>
    .example,
    .example * {
        transition: width 0.3s ease-in-out, height 0.3s ease-in-out,
            transform 0.3s ease-in-out;
        /* , opacity 0.1s ease-in-out; */
    }
    .example {
        flex: 0 0 auto;
        position: relative;
        width: var(--frame-width);
        height: var(--card-height);
        background: var(--surface-2);
        box-shadow: var(--shadow-2);
        border-radius: var(--radius-3);
    }
    .example.active {
        box-shadow: var(--shadow-6);
        z-index: 100;
    }

    .frame-wrapper {
        overflow: hidden;
        width: 100%;
        height: var(--frame-height);
        border-top-right-radius: var(--radius-3);
        border-top-left-radius: var(--radius-3);
        position: absolute;
    }
    .frame {
        width: var(--frame-inner-width);
        height: var(--frame-inner-height);
        transform: scale(var(--scale));
        transform-origin: top left;
        overflow: auto;
        position: absolute;
        z-index: 1;
    }
    .wide.example {
        width: var(--wide-card-width);
    }
    .wide .frame-wrapper {
        width: var(--wide-card-width);
        height: var(--card-height);
    }
    .wide .frame {
        transform: scale(var(--scale-wide));
    }

    .utils {
        position: absolute;
        inset: auto 0 0 auto;
        display: flex;
        align-items: center;
        gap: 16px;
        margin-right: 32px;
        margin-bottom: 16px;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 10;
    }
    .active.example:hover .utils {
        opacity: 1;
    }
    .utils * {
        width: 40px;
        opacity: 0.5;
        cursor: pointer;
        &:hover {
            opacity: 1;
        }
    }
    h1 {
        text-transform: capitalize;
        margin-bottom: 1vw;
    }
    .body {
        position: absolute;
        inset: 0;
        background: var(--surface-3);

        border-bottom-left-radius: var(--radius-3);
        border-bottom-right-radius: var(--radius-3);

        top: var(--frame-height);

        padding: 16px 48px;
        cursor: default;
    }

    .fade-overlay {
        position: absolute;
        inset: 0;
        opacity: 0.05;
        background-color: black;
        z-index: 20;
        border-radius: var(--radius-3);
    }
    .fade-overlay:hover {
        opacity: 0;
    }
    .active .fade-overlay-link {
        display: none;
    }
</style>
