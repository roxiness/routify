import { setNamedModule } from '../index.js'

test('named module', () => {
    const node = { file: { name: '_module-some-name' }, meta: {} }
    setNamedModule(node)
    assert.deepEqual(node, {
        file: { name: '_module-some-name' },
        meta: { moduleName: 'some-name' },
    })
})

test('using reset', () => {
    const node = { file: { name: 'some-page@some-module' }, meta: {} }
    setNamedModule(node)
    assert.deepEqual(node, {
        name: 'some-page',
        file: { name: 'some-page@some-module' },
        meta: { reset: 'some-module' },
    })
})
