<script context="module">
  import { writable, derived, get } from 'svelte/store'

  /** config */
  const iframeNum = 2
  const defaults = {
    validFor: 60,
    timeout: 5000,
    gracePeriod: 1000,
  }

  /** stores and subscriptions */
  const queue = writable([])
  const actives = derived(queue, q => q.slice(0, iframeNum))
  actives.subscribe(actives =>
    actives.forEach(({ options }) => {
      setTimeout(() => removeFromQueue(options.prefetch), options.timeout)
    })
  )

  /**
   * @param {string} path
   * @param {defaults} options
   */
  export function prefetch(path, options = {}) {
    prefetch.id = prefetch.id || 1
    path = !path.href ? path : path.href.replace(/^(?:\/\/|[^/]+)*\//, '/')
    //replace first ? since were mixing user queries with routify queries
    path = path.replace('?', '&')

    options = { ...defaults, ...options, path }
    options.prefetch = prefetch.id++

    //don't prefetch within prefetch or SSR
    if (window.routify.prefetched || navigator.userAgent.match('jsdom'))
      return false

    // add to queue
    queue.update(q => {
      if (!q.some(e => e.options.path === path))
        q.push({
          url: `/__app.html?${optionsToQuery(options)}`,
          options,
        })
      return q
    })
  }

  /**
   * convert options to query string
   * {a:1,b:2} becomes __routify_a=1&routify_b=2
   * @param {defaults & {path: string, prefetch: number}} options
   */
  function optionsToQuery(options) {
    return Object.entries(options)
      .map(([key, val]) => `__routify_${key}=${val}`)
      .join('&')
  }

  /**
   * @param {number|MessageEvent} idOrEvent
   */
  function removeFromQueue(idOrEvent) {
    const id = idOrEvent.data ? idOrEvent.data.prefetchId : idOrEvent
    if (!id) return null

    const entry = get(queue).find(
      entry => entry && entry.options.prefetch == id
    )
    // removeFromQueue is called by both eventListener and timeout,
    // but we can only remove the item once
    if (entry) {
      const { gracePeriod } = entry.options
      const gracePromise = new Promise(resolve =>
        setTimeout(resolve, gracePeriod)
      )
      const idlePromise = new Promise(resolve => {
        window.requestIdleCallback
          ? window.requestIdleCallback(resolve)
          : setTimeout(resolve, gracePeriod + 1000)
      })
      Promise.all([gracePromise, idlePromise]).then(() => {
        queue.update(q => q.filter(q => q.options.prefetch != id))
      })
    }
  }

  // Listen to message from child window
  addEventListener('message', removeFromQueue, false)
</script>

<div id="__routify_iframes" style="display: none">
  {#each $actives as prefetch (prefetch.options.prefetch)}
    <iframe src={prefetch.url} frameborder="0" title="routify prefetcher" />
  {/each}
</div>
