import '../../../typedef.js'
import { writable2 } from '../utils.js'

const currentUrl = () => {
    const { pathname, search, hash } = window.location
    return pathname + search + hash
}

/**
 * @param {RoutifyRuntime} instance
 * @returns
 */
export const Address = instance => {
    // todo should be urlTransformed - instance.urlTransformers
    const { set, subscribe, hooks } = writable2(currentUrl())

    return {
        set: (value, title) => {
            history.pushState({}, title, value)
            set(value)
        },
        subscribe,
    }
}
