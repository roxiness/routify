<script>
    import { params, url } from '@roxi/routify'
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
        <div class="go-back">
            <a
                data-routify-route-state-dontSmoothScroll="true"
                href={$url('$leaf', { mode: 'list' })}>Back</a>
        </div>
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
        --frame-width: 540px;
        --frame-height: 320px;
        --ratio: 2.3;
        --frame-inner-width: calc(var(--frame-width) * var(--ratio));
        --frame-inner-height: calc(var(--frame-height) * var(--ratio));
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
    .wrapper {
        background: rgb(239, 195, 236);
        background: radial-gradient(
            circle,
            rgba(239, 195, 236, 1) 0%,
            rgba(205, 135, 196, 1) 100%
        );
    }
    .go-back {
        position: fixed;
        inset: auto auto 0 0;
    }
</style>
