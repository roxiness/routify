import { fromEntries, populateUrl, pushToOrReplace } from '../index.js'

const mockRoute = {
    router: {
        queryHandler: {
            parse: search => fromEntries(new URLSearchParams(search)),
            stringify: params => {
                const query = new URLSearchParams(params).toString()
                return query ? `?${query}` : ''
            },
        },
    },
}

test('populateUrl', () => {
    test('can do root url', () => {
        const url = populateUrl('/', {}, mockRoute)
        assert.equal(url, '/')
    })

    test('can do plain url', () => {
        const url = populateUrl('/foo/bar', {}, mockRoute)
        assert.equal(url, '/foo/bar')
    })

    test('can do url with params', () => {
        const url = populateUrl('/car/[make]', { make: 'ford' }, mockRoute)
        assert.equal(url, '/car/ford')
    })

    test('can do urls with spread params', () => {
        const str = ['hello', 'world']
        const url = populateUrl('/spread/[...str]', { str }, mockRoute)
        assert.equal(url, '/spread/hello/world')
    })

    test('can do overloads', () => {
        const str = ['hello', 'world']
        const url = populateUrl('/overload', { str }, mockRoute)
        assert.equal(url, '/overload?str=hello%2Fworld')
    })
})

test('pushToOrReplace', () => {
    const arr = [1, 2, 3]
    test('constructable functions are added', () => {
        function constructable() {}
        const newArr = pushToOrReplace(arr, constructable)
        assert.deepEqual(newArr, [...arr, constructable])
    })
    test('input can be an array', () => {
        const newArr = pushToOrReplace(arr, ['a', 'b', 'c'])
        assert.deepEqual(newArr, [...arr, 'a', 'b', 'c'])
    })
    test('anonymous functions reset the array', () => {
        const anonFn = _arr => ['a']
        const newArr = pushToOrReplace(arr, anonFn)
        assert.deepEqual(newArr, ['a'])
    })
    test("anonymous functions error if they don't return array", async () => {
        let err
        try {
            const newArr = pushToOrReplace(arr, () => {})
        } catch (_err) {
            err = _err
        }
        assert.equal(err?.toString(), 'Error: anonymous callback did not return array')
    })
    test('anonymous functions can compose arrays', () => {
        const anonFn = _arr => [arr[0], 'a', arr[1], 'b', arr[2]]
        const newArr = pushToOrReplace(arr, anonFn)
        assert.deepEqual(newArr, [1, 'a', 2, 'b', 3])
    })
})
