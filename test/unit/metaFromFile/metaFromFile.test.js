import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import {
    metaFromFile,
    htmlComments,
    externalMeta,
} from '../../../plugins/metaFromFile/metaFromFile.js'
import { emptyDirSync } from 'fs-extra'
import { filemapper } from '../../../plugins/filemapper/lib/index.js'
import { RoutifyBuildtime } from '../../../lib/RoutifyBuildtime.js'

const test = suite('meta from file')
const __dirname = dirname(fileURLToPath(import.meta.url))
const externalMetaJS = import('./example/externalMeta.meta.js').then(r =>
    r.default(),
)

const expectedInline = {
    'equal-sign-trimmed': 'meta',
    'equal-sign-right ': 'meta',
    'equal-sign-left': 'meta',
    'equal-sign-center ': 'meta',
    'an-array': ['item1', 'item2'],
    'an-object': { prop: { nested: 'value' } },
    implied: true,
}
const classless = val => JSON.parse(JSON.stringify(val))

const options = {
    routifyDir: `${__dirname}/temp`,
    filemapper: {
        routesDir: { default: `${__dirname}/example` },
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

test('external meta util', async () => {
    const path = `${__dirname}/example/externalMeta.svelte`
    const meta = await externalMeta(path, options.routifyDir)

    assert.equal(meta, await externalMetaJS)
})

test('metaFromFile middleware', async () => {
    const instance = new RoutifyBuildtime(options)

    await filemapper({ instance })
    await metaFromFile({ instance })

    const inlineMetaNode = instance.nodeIndex.find(
        node => node.name === 'inlineMeta',
    )
    const externalMetaNode = instance.nodeIndex.find(
        node => node.name === 'externalMeta',
    )

    assert.equal(classless(inlineMetaNode.meta), expectedInline)
    assert.equal(classless(externalMetaNode.meta), {
        ...(await externalMetaJS),
        inlined: true,
        implied: true,
    })
})

test.run()
