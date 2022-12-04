import { RoutifyRuntime } from '../../runtime/Instance/RoutifyRuntime.js'
import { mockRoutes } from '../utils.js'

const instance = new RoutifyRuntime({})
instance.rootNodes.default = mockRoutes(instance, {
    module: {
        about: {},
        posts: { '[slug]-by-[author]': {} },
        admin: { crud: {}, users: {} },
        '[...404]': {
            '[catch-one]': {
                'i-exist': {},
            },
            'specific-error': {},
        },
    },
})

const module = instance.rootNodes.default

const nodeChainToNameAndParams = nodeChains =>
    nodeChains.map(nodeChain => [nodeChain.node.name, nodeChain.params])

test('can travel to root', () => {
    const result = module.getChainTo('/')
    assert.deepEqual(nodeChainToNameAndParams(result), [['module', {}]])
})

test('spreads catches direct matches', () => {
    const result = module.getChainTo('/no-exist')
    assert.deepEqual(nodeChainToNameAndParams(result), [
        ['module', {}],
        ['[...404]', { 404: ['no-exist'] }],
    ])
})

test('can travel to specific inside spread', () => {
    const result = module.getChainTo('/no-exist/specific-error')
    assert.deepEqual(nodeChainToNameAndParams(result), [
        ['module', {}],
        ['[...404]', { 404: ['no-exist'] }],
        ['specific-error', {}],
    ])
})

test('can fallback to spread from inside specific', () => {
    const result = module.getChainTo('/about/specific-error/no-exist')
    assert.deepEqual(nodeChainToNameAndParams(result), [
        ['module', {}],
        ['[...404]', { 404: ['about', 'specific-error'] }],
        ['[catch-one]', { 'catch-one': 'no-exist' }],
    ])
})

test('bad travel inside specific inside spread will resume spread', () => {
    const result = module.getChainTo('/no-exist/specific-error/no-exist')
    assert.deepEqual(nodeChainToNameAndParams(result), [
        ['module', {}],
        ['[...404]', { 404: ['no-exist', 'specific-error'] }],
        ['[catch-one]', { 'catch-one': 'no-exist' }],
    ])
})

test('bad travel inside specific inside spread will resume spread2', () => {
    const result = module.getChainTo('/no-exist/specific-error/no-exist/i-exist')
    assert.deepEqual(nodeChainToNameAndParams(result), [
        ['module', {}],
        ['[...404]', { 404: ['no-exist', 'specific-error'] }],
        ['[catch-one]', { 'catch-one': 'no-exist' }],
        ['i-exist', {}],
    ])
})

test('can travel to node with two params', () => {
    const result = module.getChainTo('/posts/some-story-by-john-doe')
    assert.deepEqual(nodeChainToNameAndParams(result), [
        ['module', {}],
        ['posts', {}],
        ['[slug]-by-[author]', { author: 'john-doe', slug: 'some-story' }],
    ])
})

test('throws error if static node not found', () => {
    let error
    try {
        // set allowDynamic to false
        module.getChainTo('/posts/some-story-by-john-doe', { allowDynamic: false })
    } catch (err) {
        error = err
    }
    assert.equal(error.message, 'module/posts could not travel to some-story-by-john-doe')
})

test('throws error if dynamic node not found', () => {
    const instance = new RoutifyRuntime({})
    instance.rootNodes.default = mockRoutes(instance, {
        module: {
            about: {},
        },
    })

    const module = instance.rootNodes.default
    let error
    try {
        module.getChainTo('/no-exist')
    } catch (err) {
        error = err
    }
    assert.equal(error.message, 'Could not find path "/no-exist" from module')
})
