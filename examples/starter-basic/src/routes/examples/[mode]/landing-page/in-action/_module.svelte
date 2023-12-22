<!-- routify:meta order=3 -->
<script>
    import { url, isActive, node } from '@roxi/routify'
</script>

<!-- routify:meta inline -->

<div class="features-box">
    <div class="features">
        {#each $node.linkableChildren as node}
            <a href={$url(node.path)} class:isActive={$isActive(node.path)}
                >{node.title}</a>
        {/each}
    </div>

    <div class="showcases-tabs-window" data-routify-scroll-lock>
        <slot
            anchor="header"
            inline={{
                scrollIntoView: (elem, instant) => elem.scrollIntoViewIfNeeded(),
            }} />
    </div>
</div>
<p>
    The code for this page is available in the <code
        >src/routes/examples/[mode]/landing-page</code> folder.
</p>

<style>
    .features-box {
        display: grid;
        grid-template-columns: auto 1fr;
        margin-top: 48px;
        padding: 32px;
        background: var(--surface-2);
        position: relative;
    }
    .features {
        border-right: solid 1px #ccc;
        display: flex;
        flex-direction: column;
        justify-items: center;
    }
    .features a.isActive {
        background: var(--surface-3);
    }
    .features a {
        padding: var(--size-2) min(var(--size-10), 5vw) var(--size-2) var(--size-4);
        margin: 0;
        color: var(--text-1);
        font-size: larger;
        text-decoration: none;
        font-weight: 500;
    }
    .showcases-tabs-window {
        scroll-snap-type: x mandatory;
        display: flex;
        overflow-x: scroll;
        scroll-behavior: smooth;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
    }
    .showcases-tabs-window > :global(*) {
        scroll-snap-align: start;
    }
</style>
