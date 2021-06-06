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
    directive: true,
}

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

    expect(meta.toString()).toEqual((await externalMetaJS).toString())
})

describe('metaFromFile middleware', () => {
    let explicitSplitCached

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

        explicitSplitCached = await externalMetaNode.meta.explicitSplitCached

        expect({ ...inlineMetaNode.meta }).toEqual(expectedInline)
        expect(externalMetaNode.meta.codesplitted.then).toBeTruthy()
        // todo reenable
        expect(await externalMetaNode.meta.codesplitted).toBe("I'm split")
        expect(await externalMetaNode.meta.explicit).toBe("I'm explicit")
        expect(await externalMetaNode.meta.explicitSplit).toBe(
            "I'm explicit and split",
        )
        expect(
            explicitSplitCached.startsWith("I'm explicit, split and cached"),
        ).toBeTruthy()

        await metaFromFile({ instance })

        // todo should we use the below expect?
        // expect({ ...externalMetaNode.meta }).toEqual({
        //     ...(await externalMetaJS),
        //     inlined: true,
        //     directive: true,
        // })
    })

    test('cached meta is preserved', async () => {
        const instance = new RoutifyBuildtime(options)
        await filemapper({ instance })
        await metaFromFile({ instance })
        const externalMetaNode = instance.nodeIndex.find(
            node => node.name === 'externalMeta',
        )
        // compare timestamps
        expect(await externalMetaNode.meta.explicitSplitCached).toBe(
            explicitSplitCached,
        )
    })
})

// todo meta can be json stringified with classless
// todo plugins should be used as `instance.use(plugin)`
