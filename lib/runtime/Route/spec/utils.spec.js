import { LoadCache } from '../utils.js'

const delayedPromise = (value, time) =>
    new Promise(resolve => setTimeout(() => resolve(value), time))

test('can cache', async () => {
    const loadCache = new LoadCache()

    const firstPromise = loadCache.fetch('foo', {
        hydrate: () => delayedPromise('thing' + Math.random(), 0),
    })

    const secondPromise = loadCache.fetch('foo', {
        hydrate: () => delayedPromise('thing' + Math.random(), 0),
    })

    await delayedPromise(null, 100)

    const thirdPromise = loadCache.fetch('foo', {
        hydrate: () => delayedPromise('thing' + Math.random(), 0),
    })

    const fourthPromise = loadCache.fetch('bar', {
        hydrate: () => delayedPromise('thing' + Math.random(), 0),
    })

    const [firstResult, secondResult, thirdResult, fourthResult] = await Promise.all([
        firstPromise,
        secondPromise,
        thirdPromise,
        fourthPromise,
    ])

    assert.equal(firstResult, secondResult)
    assert.equal(firstResult, thirdResult)
    assert.notEqual(firstResult, fourthResult)
})

test('cache can do instant clear', async () => {
    const loadCache = new LoadCache()
    const firstResult = await loadCache.fetch('foo', {
        hydrate: () => delayedPromise('thing' + Math.random(), 0),
    })

    const secondResult = await loadCache.fetch('foo', {
        hydrate: () => delayedPromise('thing' + Math.random(), 0),
        clear: () => true,
    })

    const thirdResult = await loadCache.fetch('foo', {
        hydrate: () => delayedPromise('thing' + Math.random(), 0),
    })

    assert.equal(firstResult, secondResult)
    assert.notEqual(firstResult, thirdResult)
})

test('cache can do delayed clear', async () => {
    const loadCache = new LoadCache()
    const firstResult = await loadCache.fetch('foo', {
        hydrate: () => delayedPromise('thing' + Math.random(), 0),
        clear: () => 100,
    })

    const secondResult = await loadCache.fetch('foo', {
        hydrate: () => delayedPromise('thing' + Math.random(), 0),
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    const thirdResult = await loadCache.fetch('foo', {
        hydrate: () => delayedPromise('thing' + Math.random(), 0),
    })

    assert.equal(firstResult, secondResult)
    assert.notEqual(firstResult, thirdResult)
})
