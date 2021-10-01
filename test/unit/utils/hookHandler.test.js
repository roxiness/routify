import { hookHandler } from '../../../lib/buildtime/utils.js'

test('can create a hook', () => {
    let counter = 0
    const hook = hookHandler()
    const unsub = hook(() => counter++)
    expect(counter).toBe(0)
    hook.runHooks()
    hook.runHooks()
    hook.runHooks()
    expect(counter).toBe(3)
    unsub()
    hook.runHooks()
    hook.runHooks()
    expect(counter).toBe(3)
})

test('can pass params in a hook', () => {
    let received = ''
    const hook = hookHandler()
    const unsub = hook(val => (received = val))
    expect(received).toBe('')
    hook.runHooks('new value')
    expect(received).toBe('new value')
    unsub()
})
