import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { RoutifyBuildtime } from '../../../lib/RoutifyBuildtime.js'
import { createDirname } from '../../../lib/utils.js'
import { RoutifyRuntime } from '../../../runtime/RoutifyRuntime.js'
const testBuildtime = suite('buildtime')
const testRuntime = suite('runtime')

const __dirname = createDirname(import.meta)

const buildtimeInstance = new RoutifyBuildtime({
    routifyDir: __dirname + '/temp',
    filemapper: {
        routesDir: {
            default: __dirname + '/example',
        },
    },
})
testBuildtime.before(async () => {
    await buildtimeInstance.start()
})

testBuildtime('buildtime node can see own meta', async () => {
    const rootNode = buildtimeInstance.superNode.children[0]
    assert.is(rootNode.meta.plain, 'Im plain')
    assert.is(rootNode.meta.function(), 'Im a function')
    assert.is(rootNode.meta.scopedPlain, 'Im scoped')

    const scopedSplitPlain = await rootNode.meta.scopedSplitPlain
    assert.is(
        scopedSplitPlain,
        "() => import('./_meta_scopedSplitPlain.js').then(r => r.default)::_EVAL",
    )
    assert.is(rootNode.meta.scopedFunction(), 'Im a scoped function')

    const scopedSplitFunction = await rootNode.meta.scopedSplitFunction
    assert.is(
        scopedSplitFunction,
        `() => import('./_meta_scopedSplitFunction.js').then(r => r.default)::_EVAL`,
    )
    assert.is(rootNode.meta.overwritten, 'original')
})

testBuildtime(
    'buildtime node can see parents scoped meta and own meta',
    async () => {
        const node = buildtimeInstance.nodeIndex.find(c => c.name === 'page')
            .children[0]
        assert.is(node.name, 'hello')
        assert.not(node.meta.plain)
        assert.not(node.meta.function)
        assert.is(node.meta.scopedPlain, 'Im scoped')

        assert.is(
            await node.meta.scopedSplitPlain,
            "() => import('./_meta_scopedSplitPlain.js').then(r => r.default)::_EVAL",
        )
        assert.is(node.meta.scopedFunction(), 'Im a scoped function')

        assert.is(
            await node.meta.scopedSplitFunction,
            `() => import('./_meta_scopedSplitFunction.js').then(r => r.default)::_EVAL`,
        )
        assert.is(node.meta.overwritten, 'new value')
    },
)

testRuntime('runtime split meta data is imported with getter', async () => {
    const { routes } = await import('./temp/routes.default.js')
    const instance = new RoutifyRuntime({ routes })
    const rootNode = instance.superNode.children[0]
    assert.is(
        rootNode.meta.__lookupGetter__('scopedSplitPlain').toString(),
        `() => import('./_meta_scopedSplitPlain.js').then(r => r.default)`,
    )
})

testRuntime('runtime node can see own meta', async () => {
    const { routes } = await import('./temp/routes.default.js')
    const instance = new RoutifyRuntime({ routes })
    const rootNode = instance.superNode.children[0]
    assert.is(rootNode.meta.plain, 'Im plain')
    assert.is(rootNode.meta.function(), 'Im a function')
    assert.is(rootNode.meta.scopedPlain, 'Im scoped')
    assert.is(await rootNode.meta.scopedSplitPlain, 'Im scoped split')
    assert.is(rootNode.meta.scopedFunction(), 'Im a scoped function')
    assert.is(
        (await rootNode.meta.scopedSplitFunction)(),
        'Im a scoped split function',
    )
    assert.is(rootNode.meta.overwritten, 'original')
})

testRuntime('runtime node can see parents scoped meta', async () => {
    const { routes } = await import('./temp/routes.default.js')
    const instance = new RoutifyRuntime({ routes })
    const node = instance.nodeIndex.find(c => c.name === 'page').children[0]
    assert.not(node.meta.plain)
    assert.not(node.meta.function)
    assert.is(node.meta.scopedPlain, 'Im scoped')
    assert.is(await node.meta.scopedSplitPlain, 'Im scoped split')
    assert.is(node.meta.scopedFunction(), 'Im a scoped function')
    assert.is(
        (await node.meta.scopedSplitFunction)(),
        'Im a scoped split function',
    )
    assert.is(node.meta.overwritten, 'new value')
})

testRuntime('split metadata gets compiled', async () => {
    const { routes } = await import('./temp/routes.default.js')
    const instance = new RoutifyRuntime({ routes })
    const node = instance.nodeIndex.find(c => c.name === 'compiled')
    assert.is(node.meta.asyncData, 'Im async')
    assert.is(await node.meta.asyncDataSplit, 'Im async split123')
})

testBuildtime.run()
testRuntime.run()
