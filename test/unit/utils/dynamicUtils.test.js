import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { createUtils } from '../../../lib/plugins/dynamic/utils.js'
import '../../../lib/../typedef.js'

const test = suite('dynamic utils')

const {
    getFieldsFromName,
    getRegexFromName,
    getValuesFromPath,
    mapFieldsWithValues,
} = createUtils()

const name = 'article-[slug]-[id]'
const path = 'article-superleague-123'

test('can get fields from name', async () => {
    const fields = getFieldsFromName(name)
    assert.equal(fields, ['slug', 'id'])
})

test('gets empty array of fields from fieldless name', async () => {
    const fields = getFieldsFromName('abc')
    assert.equal(fields, [])
})

test('can create regex from name', async () => {
    const regex = getRegexFromName(name)
    assert.is(regex.source, 'article-(.+)-(.+)')
})

test('regex is 1:1 for fieldless names', async () => {
    const regex = getRegexFromName('abc')
    assert.is(regex.source, 'abc')
})

test('can get values from path', async () => {
    const regex = getRegexFromName(name)
    const values = getValuesFromPath(regex, path)
    assert.equal(values, ['superleague', '123'])
})

test('gets empty array of values if path doesnt match regex', async () => {
    const regex = getRegexFromName(name)
    const values = getValuesFromPath(regex, 'bad-path')
    assert.equal(values, [])
})

test('can map fields with values', async () => {
    const map = mapFieldsWithValues(['slug', 'id'], ['superleague', '123'])
    assert.equal(map, { slug: 'superleague', id: '123' })
})

test('mapping fields and values requires equal length', async () => {
    let error
    try {
        mapFieldsWithValues(['slug', 'id', 'oops'], ['superleague', '123'])
    } catch (err) {
        error = err
    }

    assert.is(
        error.message,
        'fields and values should be of same length' +
            '\nfields: ["slug","id","oops"]' +
            '\nvalues: ["superleague","123"]',
    )
})

test.run()
