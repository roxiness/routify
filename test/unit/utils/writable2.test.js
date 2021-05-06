import { writable2 } from '../../../lib/runtime/utils.js'
import '../../../lib/../typedef.js'

test('can create a store', async () => {
    const store = writable2('initial')
    expect(Object.keys(store)).toEqual([
        'set',
        'subscribe',
        'update',
        'subscribers',
        'hooks',
    ])
})

test('subscribers show the correct number', async () => {
    const store = writable2('initial')
    expect(store.subscribers.length).toBe(0)
    store.subscribe(x => x)
    store.subscribe(x => x)
    store.subscribe(x => x)
    expect(store.subscribers.length).toBe(3)
})

test('hooks.onSub & hooks.onUnsub runs on every sub', async () => {
    let subCount = 0
    const store = writable2('initial')
    store.hooks.onSub = () => subCount++
    store.hooks.onUnsub = () => subCount--

    const handle1 = store.subscribe(x => x)
    const handle2 = store.subscribe(x => x)
    const handle3 = store.subscribe(x => x)

    expect(subCount).toBe(3)

    handle1()
    handle2()
    handle3()

    expect(subCount).toBe(0)
})

test('hooks.onFirstSub & hooks.onLastUnsub runs on every sub', async () => {
    let subCount = 0
    const store = writable2('initial')
    store.hooks.onFirstSub = () => subCount++
    store.hooks.onLastUnsub = () => subCount--

    const handle1 = store.subscribe(x => x)
    const handle2 = store.subscribe(x => x)
    const handle3 = store.subscribe(x => x)

    expect(subCount).toBe(1)

    handle1()
    handle2()
    handle3()

    expect(subCount).toBe(0)
})
