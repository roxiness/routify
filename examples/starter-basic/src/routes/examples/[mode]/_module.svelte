<script>
    import { params, url } from '@roxi/routify'
    import Icons from './__components/icons.svelte'
    import ExamplesDecorator from './__components/ExamplesDecorator.svelte'
    import './__assets/theme.css'
</script>

<!-- routify:meta reset -->

<!-- add content to the header with svelte -->

<div class="routify">
    {#if $params.mode === 'fullscreen'}
        <div class="frame">
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
                    inline={{
                        scrollIntoView: (elem, instant) =>
                            elem.scrollIntoView({
                                inline: 'center',
                                behavior: instant ? 'auto' : 'smooth',
                            }),
                    }}
                    decorator={{ component: ExamplesDecorator, recursive: false }} />
                <a href="/" class="back">Back</a>
            </div>
        </div>
    {/if}
</div>

<style>
    .back {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 1rem;
        font-size: 1.5rem;
        text-decoration: none;
        color: #000;
    }
    .wrapper {
        --card-height-raw: 600;
        --frame-width-raw: 540;
        --frame-height-raw: 320;

        --card-grow: calc(var(--card-height-raw) / var(--frame-height-raw));

        --card-height: calc(var(--card-height-raw) * 1px);
        --frame-width: calc(var(--frame-width-raw) * 1px);
        --frame-height: calc(var(--frame-height-raw) * 1px);

        --wide-card-width-raw: calc(var(--card-grow) * var(--frame-width-raw));
        --wide-card-width: calc(var(--wide-card-width-raw) * 1px);

        --ratio: 2.3;
        --frame-inner-width: calc(var(--frame-width) * var(--ratio));
        --frame-inner-height: calc(var(--frame-height) * var(--ratio));

        --scale: calc(1 / var(--ratio));
        --scale-wide: calc(1 / var(--ratio) * var(--card-grow));

        overflow-x: auto;
        overflow-y: hidden;
        inset: 0;
        position: fixed;
        display: flex;
    }
    .grid {
        display: grid;
        grid-auto-flow: column;
        place-items: center;
        height: 100%;
        gap: 4rem;
        margin: 0 calc(50% - (var(--frame-width) / 2));
    }
    .grid:has(.wide) {
        transition: all 0.3s ease-in-out;
        margin: 0 calc(50% - (var(--wide-card-width) / 2));
    }
    .wrapper {
        background: rgb(239, 195, 236);
        background: radial-gradient(
            circle,
            rgba(239, 195, 236, 1) 0%,
            rgba(205, 135, 196, 1) 100%
        );
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
