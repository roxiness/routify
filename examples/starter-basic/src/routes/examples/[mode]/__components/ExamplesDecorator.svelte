<script>
    import { url } from '@roxi/routify'
    import Icons from './icons.svelte'

    export let context

    $: ({ isActive, route, node } = context)
    $: path = route?.leaf.node.path || node.path
</script>

<div class="example node-{context.node.name}" class:active={$isActive}>
    <div class="frame-wrapper">
        <div class="frame">
            <slot />
        </div>
        <div class="utils">
            <a use:$url={{ mode: 'preview' }} href="$leaf">
                <Icons icon="aspect-ratio" />
            </a>
            <a
                use:$url={{ mode: 'fullscreen' }}
                href="$leaf"
                data-routify-route-state-dontSmoothScroll="true">
                <Icons icon="fullscreen" />
            </a>
        </div>
    </div>
    <div class="body">
        <h1>{context.node.name}</h1>
        <p>
            {context.node.meta.description}
        </p>
    </div>
    <a href={$url(path)} class="overlay-link">
        <div class="overlay" />
    </a>
</div>

<!-- TODO create a component that scales (transform:scale) to the dimensions of the parent element -->
<style>
    .example {
        flex: 0 0 auto;

        position: relative;
        width: var(--frame-width);
        height: 600px;
        border-radius: 16px;
        background: #f6bbe9;
        /* background: #ec9fe6; */
        box-shadow: 0px 28px 50px -9px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        /* transform: translateX(-50%); */
    }
    .example.active {
        box-shadow: 0px 56px 100px -9px rgba(0, 0, 0, 0.5);
        z-index: 100;
    }

    .frame-wrapper {
        width: 100%;
        height: var(--frame-height);
        border-radius: 16px;
        background: white;
        position: relative;
    }
    .frame {
        width: var(--frame-inner-width);
        height: var(--frame-inner-height);
        transform: scale(calc(1 / var(--ratio)));
        transform-origin: top left;
        overflow: auto;
    }

    .utils {
        position: absolute;
        inset: auto 0 0 auto;
        display: flex;
        gap: 16px;
        margin-right: 32px;
        margin-bottom: 16px;
        opacity: 0;
        transition: opacity 0.2s;
        & a {
            color: white;
        }
    }
    .active.example:hover .utils {
        opacity: 1;
    }
    .utils a {
        width: 40px;
        opacity: 0.5;
        &:hover {
            opacity: 1;
        }
    }

    p {
        font-size: 1.5vw;
    }
    h1 {
        color: rgba(0, 0, 0, 0.8);
        text-transform: capitalize;
        margin-bottom: 1vw;
    }
    .body {
        position: relative;
        padding: 16px 48px;
        color: rgba(0, 0, 0, 0.8);
        cursor: default;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0.2;
    }
    .active .overlay-link {
        display: none;
    }
    .overlay-link:hover {
        opacity: 0;
    }
</style>
