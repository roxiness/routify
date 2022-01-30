import { UrlParamUtils } from '../UrlParamUtils'

const { getFieldsFromName, getRegexFromName, getValuesFromPath, mapFieldsWithValues } =
    new UrlParamUtils()

const name = 'article-[slug]-[id]'
const path = 'article-superleague-123'

test('can get fields from name', async () => {
    const fields = getFieldsFromName(name)
    expect(fields).toEqual(['slug', 'id'])
})

test('gets empty array of fields from fieldless name', async () => {
    const fields = getFieldsFromName('abc')
    expect(fields).toEqual([])
})

test('can create regex from name', async () => {
    const regex = getRegexFromName(name)
    expect(regex.source).toBe('^article-(.+)-(.+)$')
})

test('regex is 1:1 for fieldless names', async () => {
    const regex = getRegexFromName('abc')
    expect(regex.source).toBe('^abc$')
})

test('can get values from path', async () => {
    const regex = getRegexFromName(name)
    const values = getValuesFromPath(regex, path)
    expect(values).toEqual(['superleague', '123'])
})

test('gets empty array of values if path doesnt match regex', async () => {
    const regex = getRegexFromName(name)
    const values = getValuesFromPath(regex, 'bad-path')
    expect(values).toEqual([])
})

test('can map fields with values', async () => {
    const map = mapFieldsWithValues(['slug', 'id'], ['superleague', '123'])
    expect(map).toEqual({ slug: 'superleague', id: '123' })
})

test('mapping fields and values requires equal length', async () => {
    let error
    try {
        mapFieldsWithValues(['slug', 'id', 'oops'], ['superleague', '123'])
    } catch (err) {
        error = err
    }

    expect(error.message).toBe(
        'fields and values should be of same length' +
            '\nfields: ["slug","id","oops"]' +
            '\nvalues: ["superleague","123"]',
    )
})
