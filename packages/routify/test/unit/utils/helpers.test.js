import { isActiveUrl } from '../../../lib/runtime/helpers/index.js'

expect.extend({
    toBeActive(input) {
        const [url, path, params, options] = input
        const active = isActiveUrl(url)(path, params, options)
        const pathInfo = () => `path: "${path}", params: ${JSON.stringify(params)}`
        return {
            message: () =>
                `url: "${url}" should ${active ? 'not' : ''} match ${pathInfo()}`,
            pass: !!active,
        }
    },
})

test('should ignore index', () => {
    const shouldBeTrue = [
        ['', '/index'],
        ['/', '/index'],
        ['/blog', '/blog'],
        ['/blog', '/blog/index'],
        ['/blog/', '/blog'],
        ['/blog/', '/blog/index'],
        ['/blog/index', '/blog/index'],
        ['/blog/my-title', '/blog/[slug]', { slug: 'my-title' }],
    ]

    const shouldBeFalse = [
        ['/foobar', '/foo'],
        ['/blog/my-title', '/blog/[slug]', { slug: 'bad-title' }],
    ]

    shouldBeTrue.forEach(assertIsActive)
    shouldBeFalse.forEach(assertIsNotActive)
})

test('recursive set to false should not ignore index', () => {
    const recursive = false
    const shouldBeTrue = [
        ['/blog', '/blog', {}, { recursive }],
        ['/blog/', '/blog', {}, { recursive }],
        ['/blog/index', '/blog/index', {}, { recursive }],
    ]

    const shouldBeFalse = [
        ['', '/index', {}, { recursive }],
        ['/', '/index', {}, { recursive }],
        ['/blog', '/blog/index', {}, { recursive }],
        ['/blog/', '/blog/index', {}, { recursive }],
        ['/foobar', '/foo'],
    ]

    shouldBeTrue.forEach(assertIsActive)
    shouldBeFalse.forEach(assertIsNotActive)
})

const assertIsActive = input => expect(input)['toBeActive']()

const assertIsNotActive = input => expect(input).not['toBeActive']()
