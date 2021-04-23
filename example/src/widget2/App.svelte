<script>
    import { Routify, Router } from '../../../runtime/index.js'
    import { routes } from '../../.routify/routes.widget2.js'
    const instance = new Routify({
        routes,
        debugger: true,
        urlHandler: 'internal',
    })
</script>

<h1>widget2/App.svelte</h1>

<div class="main">
    <Router {instance} />
</div>
