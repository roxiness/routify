import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { hookHandler } from '../../../lib/buildtime/utils.js'
import '../../../lib/../typedef.js'

const test = suite('hookHandler')

test('can create a hook', () => {
    let counter = 0
    const hook = hookHandler()
    const unsub = hook(() => counter++)
    assert.is(counter, 0)
    hook.callCallbacks()
    hook.callCallbacks()
    hook.callCallbacks()
    assert.is(counter, 3)
    unsub()
    hook.callCallbacks()
    hook.callCallbacks()
    assert.is(counter, 3)
})

test('can pass params in a hook', () => {
    let received = ''
    const hook = hookHandler()
    const unsub = hook(val => (received = val))
    assert.is(received, '')
    hook.callCallbacks('new value')
    assert.is(received, 'new value')
    unsub()
})

test.run()
