<script>
    import MiniBrowser from '#cmp/minibrowser/MiniBrowser.svelte'
    import { Router, InternalReflector } from '@roxi/routify'
    export let offset
    export let url = '/'
    export let urlReflector = InternalReflector
    export let name = 'example'
    export let decorator = MiniBrowser
</script>

<div class="example">
    <Router {name} {decorator} {offset} {url} {urlReflector} />
</div>

<style>
    .example {
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        padding: 48px 64px 32px 64px;
        background: #fcfdff;
    }
</style>
