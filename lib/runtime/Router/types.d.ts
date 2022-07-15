import '../Route/RouteFragment'
import { CollectionSyncVoid, CollectionAsyncVoid } from 'hookar'

type RenderContext = {
    restFragments: import('svelte/store').Writable<RouteFragment[]>
    node: RNodeRuntime
    fragment: RouteFragment
    isActive: import('svelte/store').Writable<Boolean>
    single: import('svelte/store').Writable<Boolean>
    route: import('../Route/Route').Route
    router: import('../Router/Router').Router
    parentContext: RenderContext
    decorators: typeof import('svelte/internal').SvelteComponentDev[]
    onDestroy?: CollectionSyncVoid<any> | CollectionAsyncVoid<any>
}
