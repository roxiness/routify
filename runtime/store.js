import { writable, derived } from 'svelte/store'
import '../typedef'

window.routify = window.routify || {}

/** @type {import('svelte/store').Writable<RouteNode>} */
export const route = writable(null) // the actual route being rendered

/** @type {import('svelte/store').Writable<RouteNode[]>} */
export const routes = writable([]) // all routes
routes.subscribe(routes => (window.routify.routes = routes))

export let rootContext = writable({ component: { params: {} } })

/** @type {import('svelte/store').Writable<RouteNode>} */
export const urlRoute = writable(null)  // the route matching the url

export const prefetchPath = writable("")

export const isChangingPage = writable(true)