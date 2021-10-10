import { RoutifyBuildtime } from '../../../lib/buildtime/RoutifyBuildtime.js'
import { createDirname } from '../../../lib/buildtime/utils.js'
import { RoutifyRuntime } from '../../../lib/runtime/Instance/RoutifyRuntime.js'
import fse from 'fs-extra'

const __dirname = createDirname(import.meta)

const buildtimeInstance = new RoutifyBuildtime({
    routifyDir: __dirname + '/temp',
    routesDir: {
        default: __dirname + '/example',
    },
})

beforeAll(async () => {
    fse.emptyDirSync(__dirname + '/temp')
    await buildtimeInstance.start()
})

test('buildtime node can see own meta', async () => {
    const rootNode = Object.values(buildtimeInstance.rootNodes)[0]
    expect(rootNode.meta.plain).toBe('Im plain')
    expect(rootNode.meta.function()).toBe('Im a function')
})

test('buildtime node can see parents scoped meta and own meta', async () => {
    const node = buildtimeInstance.nodeIndex.find(c => c.name === 'page').children[0]
    expect(node.name).toBe('hello')
    expect(node.meta.plain).toBeFalsy()
    expect(node.meta.function).toBeFalsy()
    expect(node.meta.overwritten).toBe('new value')
})

test('runtime node can see own meta', async () => {
    const { default: routes } = await import('./temp/routes.default.js')
    const instance = new RoutifyRuntime({ routes })
    const rootNode = Object.values(instance.rootNodes)[0]
    expect(rootNode.meta.plain).toBe('Im plain')
})

test('runtime node can see parents scoped meta', async () => {
    const { default: routes } = await import('./temp/routes.default.js')
    const instance = new RoutifyRuntime({ routes })
    const node = instance.nodeIndex.find(c => c.name === 'page').children[0]
    expect(node.meta.plain).toBeFalsy()
    expect(node.meta.function).toBeFalsy()
    // todo should we support functions?
    expect(node.meta.overwritten).toBe('new value')
})

test('split metadata gets compiled', async () => {
    const { default: routes } = await import('./temp/routes.default.js')
    const instance = new RoutifyRuntime({ routes })
    const node = instance.nodeIndex.find(c => c.name === 'compiled')
    expect(node.meta.plain).toBe('Im plain')
})
