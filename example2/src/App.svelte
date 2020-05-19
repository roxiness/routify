<script>
  import { setContext } from 'svelte'
  import { Router } from '@sveltech/routify'
  import { routes } from '@sveltech/routify/tmp/routes'
  import { writable } from 'svelte/store'
  import ServiceWorker from './ServiceWorker.svelte'

</script>

<Router {routes} />
<ServiceWorker />