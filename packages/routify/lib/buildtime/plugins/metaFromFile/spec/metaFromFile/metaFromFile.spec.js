import { dirname } from 'path'
import { fileURLToPath } from 'url'
import {
    metaFromFile,
    htmlComments,
    getExternalMeta,
} from '../../../../../buildtime/plugins/metaFromFile/metaFromFile.js'
import fse from 'fs-extra'
import { filemapper } from '../../../../../buildtime/plugins/filemapper/lib/index.js'
import { RoutifyBuildtime } from '../../../../../buildtime/RoutifyBuildtime.js'
import externalMetaCb from './example/externalMeta.meta.js'
const externalMetaJS = externalMetaCb()

/** @ts-ignore for some reason this one isn't picking up es2020 from tsconfig.json */
const __dirname = dirname(fileURLToPath(import.meta.url))

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
    routesDir: { default: `${__dirname}/example` },
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
    const meta = getExternalMeta(path)

    expect(meta.toString()).toEqual(externalMetaJS.toString())
})

describe('metaFromFile middleware', () => {
    test('metaFromFile middleware', async () => {
        const instance = new RoutifyBuildtime(options)
        await filemapper({ instance })
        await metaFromFile({ instance })

        const inlineMetaNode = instance.nodeIndex.find(node => node.name === 'inlineMeta')
        const externalMetaNode = instance.nodeIndex.find(
            node => node.name === 'externalMeta',
        )

        expect({ ...inlineMetaNode.meta }).toEqual(expectedInline)
        expect(await externalMetaNode.meta.explicit).toBe("I'm explicit")

        await metaFromFile({ instance })

        // todo should we use the below expect?
        // expect({ ...externalMetaNode.meta }).toEqual({
        //     ...(await externalMetaJS),
        //     inlined: true,
        //     directive: true,
        // })
    })
})
// todo meta can be json stringified with classless
// todo plugins should be used as `instance.use(plugin)`
