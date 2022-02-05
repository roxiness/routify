import { RoutifyBuildtime } from '../../../lib/buildtime/RoutifyBuildtime.js'
import { createDirname } from '../../../lib/buildtime/utils.js'
import { resolve } from 'path'
import { unlinkSync, writeFileSync } from 'fs'
import fse from 'fs-extra'

const __dirname = createDirname(import.meta)

/** @type {RoutifyBuildtime} */
let instance

beforeAll(async () => {
    fse.emptyDirSync(resolve(__dirname, 'example', 'temp'))
    fse.emptyDirSync(resolve(__dirname, 'temp'))

    instance = new RoutifyBuildtime({
        routifyDir: resolve(__dirname, 'temp', '.routify'),
        routesDir: resolve(__dirname, 'example'),
        watch: true,
    })
    await instance.start()
})

afterAll(async () => {
    await instance.close()
})

const filepath = resolve(__dirname, 'example', 'temp', 'NewFile.svelte')
const renamedFilepath = resolve(__dirname, 'example', 'temp', 'NewFile2.svelte')

test('detects new files', async () => {
    expect(Object.values(instance.rootNodes)[0].descendants.length).toBe(2)
    writeFileSync(filepath, '<!-- hello -->')
    await new Promise(resolve => instance.on.buildComplete(resolve))
    expect(Object.values(instance.rootNodes)[0].descendants.length).toBe(3)
})

test('detects removed files', async () => {
    expect(Object.values(instance.rootNodes)[0].descendants.length).toBe(3)
    unlinkSync(filepath)
    await new Promise(resolve => instance.on.buildComplete(resolve))
    expect(Object.values(instance.rootNodes)[0].descendants.length).toBe(2)
})

test('detects renamed files', async () => {
    writeFileSync(filepath, '<!-- hello -->')
    await new Promise(resolve => instance.on.buildComplete(resolve))
    expect(Object.values(instance.rootNodes)[0].descendants.length).toBe(3)
    fse.renameSync(filepath, renamedFilepath)
    await new Promise(resolve => instance.on.buildComplete(resolve))
    // required
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(
        Object.values(instance.rootNodes)[0].descendants.find(
            node => node.name === 'NewFile2',
        ),
    ).toBeTruthy()
})
