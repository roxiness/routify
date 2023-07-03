<!-- routify:meta order=4 -->
<script>
    import { url } from '@roxi/routify'
    export let context
</script>

<!-- routify:meta inline -->

<h1>Showcases</h1>

<div class="features-box">
    <div class="features">
        <a href={$url('./coffee')}>Coffee</a>
        <a href={$url('./ice-cream')}>Ice cream</a>
        <a href={$url('./tea')}>Tea</a>
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
        padding: 2px 32px 0 16px;

        border-right: solid 1px #ccc;
    }
    a {
        display: block;
        font-size: larger;
        text-decoration: none;
    }
    .showcases-tabs-window {
        margin: 0 20px;
        display: flex;
        overflow-x: hidden;
        flex-wrap: nowrap;

        /* width: 800px; */
        scroll-behavior: smooth;
    }
</style>
