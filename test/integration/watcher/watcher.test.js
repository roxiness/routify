import '../../../lib/../typedef.js'

import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { RoutifyBuildtime } from '../../../lib/buildtime/RoutifyBuildtime.js'
import '../../../lib/../typedef.js'
import { createDirname } from '../../../lib/buildtime/utils.js'
import { resolve } from 'path'
import { unlinkSync, writeFileSync } from 'fs'
import fse, { emptyDirSync } from 'fs-extra'

const test = suite('routify')

const __dirname = createDirname(import.meta)

/** @type {RoutifyBuildtime} */
let instance

test.before(async () => {
    emptyDirSync(resolve(__dirname, 'example', 'temp'))
    emptyDirSync(resolve(__dirname, 'temp'))

    instance = new RoutifyBuildtime({
        routifyDir: resolve(__dirname, 'temp', '.routify'),
        filemapper: {
            routesDir: resolve(__dirname, 'example'),
        },
        watch: true,
    })
    await instance.start()
})
const filepath = resolve(__dirname, 'example', 'temp', 'NewFile.svelte')
const renamedFilepath = resolve(__dirname, 'example', 'temp', 'NewFile2.svelte')

test('detects new files', async () => {
    assert.is(instance.superNode.children[0].descendants.length, 2)
    writeFileSync(filepath, '<!-- hello -->')
    await new Promise(resolve => instance.on.buildComplete(resolve))
    assert.is(instance.superNode.children[0].descendants.length, 3)
})

test('detects removed files', async () => {
    assert.is(instance.superNode.children[0].descendants.length, 3)
    unlinkSync(filepath)
    await new Promise(resolve => instance.on.buildComplete(resolve))
    assert.is(instance.superNode.children[0].descendants.length, 2)
})

test('detects renamed files', async () => {
    writeFileSync(filepath, '<!-- hello -->')
    await new Promise(resolve => instance.on.buildComplete(resolve))
    assert.is(instance.superNode.children[0].descendants.length, 3)
    fse.renameSync(filepath, renamedFilepath)
    await new Promise(resolve => instance.on.buildComplete(resolve))
    assert.ok(
        instance.superNode.children[0].descendants.find(
            node => node.name === 'NewFile2',
        ),
    )
})

test.run()
