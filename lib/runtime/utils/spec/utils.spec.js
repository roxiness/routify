import { fromEntries, populateUrl } from '../index.js'

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
