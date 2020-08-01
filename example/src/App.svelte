<script>
  import { setContext } from 'svelte'
  import { Router, basepath } from '@roxi/routify'
  import { routes } from '../.routify/routes'
  import { writable } from 'svelte/store'
  import ServiceWorker from './ServiceWorker.svelte'

  const config = {}
  const params = new URLSearchParams(location.search)
  const bp = params.get('basepath')
  const ut = params.get('urlTransform')

  if (bp) $basepath = bp
  if (ut) {
    const re = new RegExp(`^/${ut}`)
    config.urlTransform = {
      apply: (x) => `/${ut}${x}`,
      remove: (x) => x.replace(re, ''),
    }
  }
</script>

<Router {routes} {config} />
<ServiceWorker />
