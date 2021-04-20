import { writable, get } from 'svelte/store'

const currentUrl = () => {
    const { pathname, search, hash } = window.location
    return pathname + search + hash
}

const createUrlStoreAddress = instance => {
    // todo should be urlTransformed - instance.urlTransformers

    const { set, subscribe, update, hooks } = writable2(currentUrl)

    return {
        set,
        subscribe,
        update,
    }
}

// pushstate: () => updatePage(),
// replacestate: () => updatePage(),

export { createUrlStoreAddress }

const test = createUrlStoreAddress()

const handle = test.subscribe(() => {})
const handle2 = test.subscribe(() => {})
const handle3 = test.subscribe(() => {})

handle()
