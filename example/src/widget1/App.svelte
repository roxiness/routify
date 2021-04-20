<script>
    import { Routify, Router } from '../../../runtime/index.js'
    import { routes } from '../../.routify/routes.widget1.js'
    const instance = new Routify({ routes, debugger: true })
</script>

<h1>App.svelte</h1>

<div class="main">
    <Router {instance} />
</div>
