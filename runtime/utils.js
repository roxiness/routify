import { writable } from 'svelte/store'

/**
 * writable with subscription hooks
 * @param {any} value
 */
export const writable2 = value => {
    let subscribers = []
    let { set, subscribe, update } = writable(value)

    const hooks = {
        onSub: () => {},
        onUnsub: () => {},
        onFirstSub: () => {},
        onLastUnsub: () => {},
    }

    const newSubscribe = (run, invalidator) => {
        // hooks
        hooks.onSub()
        if (!subscribers.length) hooks.onFirstSub()

        const unsub = subscribe(run, invalidator)
        subscribers.push(unsub)
        return () => {
            hooks.onUnsub()
            if (subscribers.length === 1) hooks.onLastUnsub()

            subscribers = subscribers.filter(_unsub => _unsub !== unsub)
            unsub()
        }
    }

    return {
        set,
        subscribe: newSubscribe,
        update,
        subscribers,
        hooks,
    }
}
