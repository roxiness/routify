<script>
    import { params, url } from '@roxi/routify'
    import Icons from './__components/icons.svelte'
    import ExamplesDecorator from './__components/ExamplesDecorator.svelte'
    import './__assets/theme.css'
    import ThemeSelector from './__components/ThemeSelector.svelte'
    let theme
    const scrollIntoView = (elem, instant) =>
        elem.scrollIntoView({ inline: 'center', behavior: instant ? 'auto' : 'smooth' })
</script>

<!-- routify:meta reset -->
<!-- routify:meta bundle -->

<div class="routify" color-scheme={theme}>
    {#if $params.mode === 'full'}
        <div class="frame fullscreen">
            <slot />
        </div>

        <a
            class="exit-fullscreen"
            data-routify-route-state-dontSmoothScroll="true"
            href={$url('$leaf', { mode: 'list' })}>
            <Icons icon="fullscreen-exit" /></a>
    {:else}
        <div class="wrapper">
            <div class="grid">
                <slot
                    inline={{ scrollIntoView, context: 'always' }}
                    decorator={{ component: ExamplesDecorator, recursive: false }} />
            </div>
        </div>
    {/if}
    <div class="links">
        <a href="/" class="back">Back</a>
    </div>

    <ThemeSelector bind:theme />
</div>

<style>
    .links {
        position: fixed;
        inset: auto auto 0 0;
        padding: 1rem;
        font-size: 1.5rem;
        text-decoration: none;
        color: #000;
    }
    .routify {
        --nav-height: 80px;

        --card-height-raw: 600;
        --frame-width-raw: 540;
        --frame-height-raw: 320;
        --ratio: 1.8;

        --card-grow: calc(var(--card-height-raw) / var(--frame-height-raw));

        --card-height: calc(var(--card-height-raw) * 1px);
        --frame-width: calc(var(--frame-width-raw) * 1px);
        --frame-height: calc(var(--frame-height-raw) * 1px);

        --wide-card-width-raw: calc(var(--card-grow) * var(--frame-width-raw));
        --wide-card-width: calc(var(--wide-card-width-raw) * 1px);

        --frame-inner-width: calc(var(--frame-width) * var(--ratio));
        --frame-inner-height: calc(var(--frame-height) * var(--ratio));

        --scale: calc(1 / var(--ratio));
        --scale-wide: calc(1 / var(--ratio) * var(--card-grow));
    }
    .frame.fullscreen {
        --frame-height: 100vh;
        --frame-inner-height: calc(100vh);
    }
    .wrapper {
        overflow-x: auto;
        overflow-y: hidden;
        inset: 0;
        position: fixed;
        display: flex;

        background: var(--surface-2);
    }
    .grid {
        display: grid;
        grid-auto-flow: column;
        place-items: center;
        height: 100%;
        gap: 4rem;
        margin: 0 calc(50% - (var(--frame-width) / 2));
        transition: all 0.3s ease-in-out;
    }
    .grid:has(.wide) {
        margin: 0 calc(50% - (var(--wide-card-width) / 2));
    }
    .exit-fullscreen {
        position: fixed;
        inset: auto 32px 16px auto;

        color: white;
        width: 64px;
        opacity: 0.5;
        &:hover {
            opacity: 1;
        }
    }
</style>
