<!-- routify:meta order=4 -->
<script>
    import { url, isActive, node } from '@roxi/routify'
    export let context
</script>

<!-- routify:meta inline -->

<h1>Showcases</h1>

<div class="features-box">
    <div class="features">
        {#each $node.pages as node}
            <a href={$url(node.path)} class:isActive={$isActive(node.path)}
                >{node.title}</a>
        {/each}
    </div>

    <div class="showcases-tabs-window">
        <slot
            inline={{
                scrollIntoView: (elem, instant) => elem.scrollIntoViewIfNeeded(),
            }} />
    </div>
</div>

<!-- todo on leaving route, stamp it's url for later recovery, eg for multi  -->
<style>
    .features-box {
        display: grid;
        grid-template-columns: auto 1fr;
        margin-top: 16px;
    }
    .features {
        border-right: solid 1px #ccc;
        display: flex;
        flex-direction: column;
        justify-items: center;
    }
    .features a.isActive {
        background: var(--surface-2);
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
    }
</style>
