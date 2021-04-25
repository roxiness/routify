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
    assert.is(rootNode.meta.scopedSplitPlain, 'Im scoped split')
    assert.is(rootNode.meta.scopedFunction(), 'Im a scoped function')
    assert.is(rootNode.meta.scopedSplitFunction(), 'Im a scoped split function')
    assert.is(rootNode.meta.overwritten, 'original')
})

testBuildtime(
    'buildtime node can see parents scoped meta and own meta',
    async () => {
        const node =
            buildtimeInstance.superNode.children[0].children[0].children[0]
        assert.is(node.name, 'hello')
        assert.not(node.meta.plain)
        assert.not(node.meta.function)
        assert.is(node.meta.scopedPlain, 'Im scoped')
        assert.is(node.meta.scopedSplitPlain, 'Im scoped split')
        assert.is(node.meta.scopedFunction(), 'Im a scoped function')
        assert.is(node.meta.scopedSplitFunction(), 'Im a scoped split function')
        assert.is(node.meta.overwritten, 'new value')
    },
)

testRuntime('runtime node can see own meta', async () => {
    const { routes } = await import('./temp/routes.default.js')
    const instance = new RoutifyRuntime({ routes })
    const rootNode = instance.superNode.children[0]
    assert.is(rootNode.meta.plain, 'Im plain')
    assert.is(rootNode.meta.function(), 'Im a function')
    assert.is(rootNode.meta.scopedPlain, 'Im scoped')
    assert.is(rootNode.meta.scopedSplitPlain, 'Im scoped split')
    assert.is(rootNode.meta.scopedFunction(), 'Im a scoped function')
    assert.is(rootNode.meta.scopedSplitFunction(), 'Im a scoped split function')
    assert.is(rootNode.meta.overwritten, 'original')
})

testRuntime('runtime node can see parents scoped meta', async () => {
    const { routes } = await import('./temp/routes.default.js')
    const instance = new RoutifyRuntime({ routes })
    const node = instance.superNode.children[0].children[0].children[0]
    assert.not(node.meta.plain)
    assert.not(node.meta.function)
    assert.is(node.meta.scopedPlain, 'Im scoped')
    assert.is(node.meta.scopedSplitPlain, 'Im scoped split')
    assert.is(node.meta.scopedFunction(), 'Im a scoped function')
    assert.is(node.meta.scopedSplitFunction(), 'Im a scoped split function')
    assert.is(node.meta.overwritten, 'new value')
})

testBuildtime.run()
testRuntime.run()
