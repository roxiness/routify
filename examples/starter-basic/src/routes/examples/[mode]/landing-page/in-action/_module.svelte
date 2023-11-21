<!-- routify:meta order=3 -->
<script>
    import { url, isActive, node } from '@roxi/routify'
</script>

<!-- routify:meta inline -->

<h2>Inline Pages in Action</h2>
<p>
    Wondering how Inline Pages work in a real-world scenario? This page is built using
    inline pages. Every section is a separate page, and the navigation is handled by
    Routify. The result is a seamless browsing experience, with no page reloads or
    interruptions. The tabbed window below also uses inline pages.
</p>
<p>
    The code for this page is available in the <code
        >src/routes/examples/[mode]/landing-page</code> folder.
</p>
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
        display: flex;
        overflow-x: hidden;
        flex-wrap: nowrap;
        scroll-behavior: smooth;
        position: relative;
        z-index: 0;
    }
</style>
