<script>
    import * as icons from './icons/index.js'
    export let name
</script>

<span>
    {@html icons[name]}
</span>

<style>
    span {
        line-height: 0;
    }
    span :global(svg) {
        /* stroke-width: 2px; */
        /* stroke: #636c75; */
    }
</style>
