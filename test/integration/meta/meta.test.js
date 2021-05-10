import { RoutifyBuildtime } from '#lib/buildtime/RoutifyBuildtime.js'
import { createDirname } from '#lib/buildtime/utils.js'
import { RoutifyRuntime } from '#lib/runtime/Instance/RoutifyRuntime.js'
import fse from 'fs-extra'

const __dirname = createDirname(import.meta)

const buildtimeInstance = new RoutifyBuildtime({
    routifyDir: __dirname + '/temp',
    filemapper: {
        routesDir: {
            default: __dirname + '/example',
        },
    },
})

beforeAll(async () => {
    fse.emptyDirSync(__dirname + '/temp')
    await buildtimeInstance.start()
})

test('buildtime node can see own meta', async () => {
    const rootNode = buildtimeInstance.superNode.children[0]
    expect(rootNode.meta.plain).toBe('Im plain')
    expect(rootNode.meta.function()).toBe('Im a function')
    expect(rootNode.meta.scopedPlain).toBe('Im scoped')

    const scopedSplitPlain = await rootNode.meta.scopedSplitPlain
    expect(scopedSplitPlain).toBe(
        "() => import('./meta/_default/scopedSplitPlain.js').then(r => r.default)::_EVAL",
    )
    expect(rootNode.meta.scopedFunction()).toBe('Im a scoped function')

    const scopedSplitFunction = await rootNode.meta.scopedSplitFunction
    expect(scopedSplitFunction).toBe(
        `() => import('./meta/_default/scopedSplitFunction.js').then(r => r.default)::_EVAL`,
    )
    expect(rootNode.meta.overwritten).toBe('original')
})

test('buildtime node can see parents scoped meta and own meta', async () => {
    const node = buildtimeInstance.nodeIndex.find(c => c.name === 'page')
        .children[0]
    expect(node.name).toBe('hello')
    expect(node.meta.plain).toBeFalsy()
    expect(node.meta.function).toBeFalsy()
    expect(node.meta.scopedPlain).toBe('Im scoped')

    expect(await node.meta.scopedSplitPlain).toBe(
        "() => import('./meta/_default/scopedSplitPlain.js').then(r => r.default)::_EVAL",
    )
    expect(node.meta.scopedFunction()).toBe('Im a scoped function')

    expect(await node.meta.scopedSplitFunction).toBe(
        `() => import('./meta/_default/scopedSplitFunction.js').then(r => r.default)::_EVAL`,
    )
    expect(node.meta.overwritten).toBe('new value')
})

test('runtime split meta data is imported with getter', async () => {
    const { routes } = await import('./temp/routes.default.js')
    const instance = new RoutifyRuntime({ routes })
    const rootNode = instance.superNode.children[0]
    expect(rootNode.meta.__lookupGetter__('scopedSplitPlain').toString()).toBe(
        `() => import('./meta/_default/scopedSplitPlain.js').then(r => r.default)`,
    )
})

test('runtime node can see own meta', async () => {
    const { routes } = await import('./temp/routes.default.js')
    const instance = new RoutifyRuntime({ routes })
    const rootNode = instance.superNode.children[0]
    expect(rootNode.meta.plain).toBe('Im plain')
    expect(rootNode.meta.function()).toBe('Im a function')
    expect(rootNode.meta.scopedPlain).toBe('Im scoped')
    expect(await rootNode.meta.scopedSplitPlain).toBe('Im scoped split')
    expect(rootNode.meta.scopedFunction()).toBe('Im a scoped function')
    expect((await rootNode.meta.scopedSplitFunction)()).toBe(
        'Im a scoped split function',
    )
    expect(rootNode.meta.overwritten).toBe('original')
})

test('runtime node can see parents scoped meta', async () => {
    const { routes } = await import('./temp/routes.default.js')
    const instance = new RoutifyRuntime({ routes })
    const node = instance.nodeIndex.find(c => c.name === 'page').children[0]
    expect(node.meta.plain).toBeFalsy()
    expect(node.meta.function).toBeFalsy()
    expect(node.meta.scopedPlain).toBe('Im scoped')
    expect(await node.meta.scopedSplitPlain).toBe('Im scoped split')
    expect(node.meta.scopedFunction()).toBe('Im a scoped function')
    expect((await node.meta.scopedSplitFunction)()).toBe(
        'Im a scoped split function',
    )
    expect(node.meta.overwritten).toBe('new value')
})

test('split metadata gets compiled', async () => {
    const { routes } = await import('./temp/routes.default.js')
    const instance = new RoutifyRuntime({ routes })
    const node = instance.nodeIndex.find(c => c.name === 'compiled')
    expect(node.meta.plain).toBe('Im plain')
    expect(await node.meta.asyncDataSplit).toBe('Im async split123')
})
