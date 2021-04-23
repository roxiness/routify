<script>
    import { Router, instance } from '../../.routify/instance.widget1.js'
    instance.options.debugger = true
    instance.options.urlHandler = 'internal'
</script>

<div class="main">
    <Router {instance} />
</div>
