import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { dirname } from "path";
import { fileURLToPath } from 'url';
import metaFromFile, { htmlComments, externalComments } from '../../../plugins/metaFromFile/lib/index.js';
import { emptyDirSync } from 'fs-extra'
import { Routify } from '../../../lib/Routify.js';
import { filemapper } from '../../../plugins/filemapper/lib/index.js';

const test = suite('meta from file')
const __dirname = dirname(fileURLToPath(import.meta.url))
const expectedExternal = {
    "prop": "value",
    "nested": {
        "nestedProp": "nestedValue"
    },
    "codesplitted": {}
}
const expectedInline = {
    'equal-sign-trimmed': 'meta',
    'equal-sign-right ': 'meta',
    'equal-sign-left': 'meta',
    'equal-sign-center ': 'meta',
    'an-array': ['item1', 'item2'],
    'an-object': { prop: { nested: 'value' } }
}
const classless = val => JSON.parse(JSON.stringify(val))

const options = {
    routifyDir: `${__dirname}/output`,
    filemapper: {
        routesDir: { default: `${__dirname}/example` }
    },
}
test.before.each(() => {
    emptyDirSync(options.routifyDir)
})

test('inline meta', async () => {
    const path = `${__dirname}/example/inlineMeta.svelte`
    const meta = await htmlComments(path)
    assert.equal(meta, expectedInline)
})

test('external meta', async () => {
    const path = `${__dirname}/example/externalMeta.svelte`
    const meta = await externalComments(path, options.routifyDir)
    assert.equal(classless(meta), expectedExternal)
    assert.ok(meta.codesplitted.then, 'should be a promise')
    assert.snapshot(
        await meta.codesplitted,
        "I'm split",
        'accessing codesplit prop should return Promise<value>'
    )
})

test('metaFromFile middleware', async () => {
    const instance = new Routify(options)

    await filemapper({ instance })
    await metaFromFile({ instance })

    const inlineMetaFile = instance.nodeIndex.find(node => node.name === 'inlineMeta')
    const externalMetaFile = instance.nodeIndex.find(node => node.name === 'externalMeta')

    assert.equal(classless(inlineMetaFile.meta), expectedInline)
    assert.equal(classless(externalMetaFile.meta), { ...expectedExternal, inlined: true })
    assert.ok(externalMetaFile.meta.codesplitted.then, 'should be a promise')
    assert.snapshot(
        await externalMetaFile.meta.codesplitted,
        "I'm split",
        'accessing codesplit prop should return Promise<value>'
    )
})

test.run()