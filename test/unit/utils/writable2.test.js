import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { writable2 } from '../../../lib/runtime/utils.js'
import '../../../lib/../typedef.js'

const test = suite('writable2')

test('can create a store', async () => {
    const store = writable2('initial')
    assert.equal(Object.keys(store), [
        'set',
        'subscribe',
        'update',
        'subscribers',
        'hooks',
    ])
})

test('subscribers show the correct number', async () => {
    const store = writable2('initial')
    assert.is(store.subscribers.length, 0)
    store.subscribe(x => x)
    store.subscribe(x => x)
    store.subscribe(x => x)
    assert.is(store.subscribers.length, 3)
})

test('hooks.onSub & hooks.onUnsub runs on every sub', async () => {
    let subCount = 0
    const store = writable2('initial')
    store.hooks.onSub = () => subCount++
    store.hooks.onUnsub = () => subCount--

    const handle1 = store.subscribe(x => x)
    const handle2 = store.subscribe(x => x)
    const handle3 = store.subscribe(x => x)

    assert.is(subCount, 3)

    handle1()
    handle2()
    handle3()

    assert.is(subCount, 0)
})

test('hooks.onFirstSub & hooks.onLastUnsub runs on every sub', async () => {
    let subCount = 0
    const store = writable2('initial')
    store.hooks.onFirstSub = () => subCount++
    store.hooks.onLastUnsub = () => subCount--

    const handle1 = store.subscribe(x => x)
    const handle2 = store.subscribe(x => x)
    const handle3 = store.subscribe(x => x)

    assert.is(subCount, 1)

    handle1()
    handle2()
    handle3()

    assert.is(subCount, 0)
})

test.run()
