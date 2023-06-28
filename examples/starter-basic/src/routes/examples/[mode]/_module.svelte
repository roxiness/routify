<script context="module">
    import ExamplesDecorator from './__components/ExamplesDecorator.svelte'

    export const load = ctx => {
        console.log('ctx', ctx)
        console.log('route', ctx.route.params)
    }
</script>

<script>
    import { params } from '@roxi/routify'

    console.log('params', $params)
</script>

<!-- routify:meta reset -->

<!-- add content to the header with svelte -->

{#if $params.mode === 'fullscreen'}
    <slot />
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
        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
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
    :global(html) {
        background: rgb(239, 195, 236);
        background: radial-gradient(
            circle,
            rgba(239, 195, 236, 1) 0%,
            rgba(205, 135, 196, 1) 100%
        );
    }
</style>
