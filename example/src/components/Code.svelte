<script>
    import Prism from 'svelte-prism'
    // import './prismjs.css'
    export let language
</script>

<Prism {language}>
    <slot />
</Prism>

<!-- <link
    rel="stylesheet"
    href="https://gitcdn.link/repo/PrismJS/prism-themes/master/themes/prism-coldark-cold.css" /> -->

<!-- <link
    rel="stylesheet"
    href="https://gitcdn.link/repo/PrismJS/prism-themes/master/themes/prism-material-light.css" /> -->

<!-- <link
    rel="stylesheet"
    href="https://gitcdn.link/repo/PrismJS/prism-themes/master/themes/prism-coy-without-shadows.css" />

<style>
    :global(code, pre) {
        background: #fcfdff !important;
    }
    :global(pre) {
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
    }
</style> -->
