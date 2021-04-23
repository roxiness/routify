<script>
    import { Router, instance } from '../../.routify/instance.widget1.js'
    instance.options.debugger = true
    instance.options.urlHandler = 'internal'
</script>

<h1>widget1/App.svelte</h1>

<div class="main">
    <Router {instance} />
</div>
