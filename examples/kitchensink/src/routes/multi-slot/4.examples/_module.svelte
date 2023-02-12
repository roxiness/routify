<script>
    import { url, activeRoute } from '@roxi/routify'
    export let context
    console.log('ctx', context)
    console.log('route', $activeRoute)
    console.log('leaf', $activeRoute.leaf)
</script>

<h1>Examples</h1>

<a href={$url('./number-1')}>no1</a>
<a href={$url('./number-2')}>no2</a>
<a href={$url('./number-3')}>no3</a>

<div class="examples-wrapper">
    <slot multi />
</div>

<!-- todo on leaving route, stamp it's url for later recovery, eg for multi  -->
<style>
    /* own stuff */
    .examples-wrapper {
        margin-left: 100px;
        display: flex;
        overflow-x: hidden;
        flex-wrap: nowrap;
        width: 800px;
        height: 300px;
    }
</style>
