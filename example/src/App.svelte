<script>
    import Widget1 from './widget1/App.svelte'
    import Widget2 from './widget2/App.svelte'
    import { Routify, Router } from '../../runtime/index.js'
    import { routes } from '../.routify/routes.widget2.js'
    const instance = new Routify({ routes })
</script>

<h1>App.svelte</h1>

<div class="main">
    <Router {instance} />
</div>

<div>
    <Widget1 />
</div>
<div>
    <Widget2 />
</div>

<style>
    div {
        position: relative;
    }
</style>
