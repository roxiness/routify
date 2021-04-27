import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { _isActive } from '../../../lib/runtime/helpers.js'
import '../../../lib/../typedef.js'

const isActiveTest = suite('isActive')

isActiveTest('no "strict" should ignore index', () => {
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

isActiveTest('"strict" should not ignore index', () => {
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

isActiveTest.run()

/**
 * @param {[string, string, object, object]} input
 * @param {boolean} shouldBe
 */
const _assertActive = (input, shouldBe) => {
    const [url, path, params, options] = input
    const active = _isActive(url)(path, params, options)
    const pathInfo = () => `path: "${path}", params: ${JSON.stringify(params)}`
    if (shouldBe) assert.ok(active, `url: "${url}" should match ${pathInfo()}`)
    else assert.not(active, `url: "${url}" should not match ${pathInfo()}`)
}

const assertIsActive = input => _assertActive(input, true)

const assertIsNotActive = input => _assertActive(input, false)
