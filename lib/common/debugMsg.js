import { get } from 'svelte/store'

export const routeHasChangedMsg = route => {
    const { router } = route
    const pendingRoute = get(router.pendingRoute)
    router.log.debug(
        `route changed to "${
            pendingRoute?.url || get(router.activeRoute).url
        }". Skipping remaining guards for "${route.url}"`,
        route,
    )
}
