import { dirname } from 'path'
import { fileURLToPath } from 'url'
import {
    metaFromFile,
    htmlComments,
    externalMeta,
} from '#lib/plugins/metaFromFile/metaFromFile.js'
import fse from 'fs-extra'
import { filemapper } from '#lib/plugins/filemapper/lib/index.js'
import { RoutifyBuildtime } from '#lib/buildtime/RoutifyBuildtime.js'

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
beforeEach(() => {
    fse.emptyDirSync(options.routifyDir)
})

test('inline meta', async () => {
    const path = `${__dirname}/example/inlineMeta.svelte`
    const meta = await htmlComments(path)
    expect(meta).toEqual(expectedInline)
})

test('external meta util', async () => {
    const path = `${__dirname}/example/externalMeta.svelte`
    const meta = await externalMeta(path)

    expect(meta).toEqual(await externalMetaJS)
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

    expect(classless(inlineMetaNode.meta)).toEqual(expectedInline)
    expect(classless(externalMetaNode.meta)).toEqual({
        ...(await externalMetaJS),
        inlined: true,
        implied: true,
    })
})
