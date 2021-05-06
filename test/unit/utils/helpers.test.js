import { _isActive } from '../../../lib/runtime/helpers.js'
import '../../../lib/../typedef.js'

expect.extend({
    toBeActive(input) {
        const [url, path, params, options] = input
        const active = _isActive(url)(path, params, options)
        const pathInfo = () =>
            `path: "${path}", params: ${JSON.stringify(params)}`
        return active
            ? {
                  message: () => `url: "${url}" should not match ${pathInfo()}`,
                  pass: true,
              }
            : {
                  message: () => `url: "${url}" should match ${pathInfo()}`,
                  pass: false,
              }
    },
})

test('no "strict" should ignore index', () => {
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

test('"strict" should not ignore index', () => {
    const strict = true
    const shouldBeTrue = [
        ['/blog', '/blog', {}, { strict }],
        ['/blog/', '/blog', {}, { strict }],
        ['/blog/index', '/blog/index', {}, { strict }],
    ]

    const shouldBeFalse = [
        ['', '/index', {}, { strict }],
        ['/', '/index', {}, { strict }],
        ['/blog', '/blog/index', {}, { strict }],
        ['/blog/', '/blog/index', {}, { strict }],
        ['/foobar', '/foo'],
    ]

    shouldBeTrue.forEach(assertIsActive)
    shouldBeFalse.forEach(assertIsNotActive)
})

const assertIsActive = input => expect(input).toBeActive()

const assertIsNotActive = input => expect(input).not.toBeActive()
