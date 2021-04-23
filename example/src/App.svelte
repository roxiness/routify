<script>
    import { Routify, Router } from '../../runtime/index.js'
    import { routes } from '../.routify/routes.default.js'
    const instance = new Routify({ routes, debugger: true })
</script>

<h1>App.svelte</h1>

<a href="#outside-1">outside-link 1</a>
<a href="#outside-2">outside-link 2</a>

<div class="main">
    <Router {instance} />
</div>

<style>
    div {
        position: relative;
    }
</style>
