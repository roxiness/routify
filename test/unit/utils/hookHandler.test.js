import { hookHandler } from '../../../lib/buildtime/utils.js'
import '../../../lib/../typedef.js'

test('can create a hook', () => {
    let counter = 0
    const hook = hookHandler()
    const unsub = hook(() => counter++)
    expect(counter).toBe(0)
    hook.callCallbacks()
    hook.callCallbacks()
    hook.callCallbacks()
    expect(counter).toBe(3)
    unsub()
    hook.callCallbacks()
    hook.callCallbacks()
    expect(counter).toBe(3)
})

test('can pass params in a hook', () => {
    let received = ''
    const hook = hookHandler()
    const unsub = hook(val => (received = val))
    expect(received).toBe('')
    hook.callCallbacks('new value')
    expect(received).toBe('new value')
    unsub()
})
