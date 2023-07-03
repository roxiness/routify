<!-- routify:meta order=4 -->
<script>
    import { url } from '@roxi/routify'
    export let context
</script>

<!-- routify:meta inline -->

<h1>Showcases</h1>

<div>
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

<!-- todo on leaving route, stamp it's url for later recovery, eg for multi  -->
<style>
    .showcases-tabs-window {
        display: flex;
        overflow-x: hidden;
        flex-wrap: nowrap;

        /* width: 800px; */
        scroll-behavior: smooth;
    }
</style>
