import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { exporter } from '../../../plugins/exporter/exporter.js'
import { filemapper } from '../../../plugins/filemapper/lib/index.js'
import { Routify } from '../../../lib/Routify.js'


const __dirname = dirname(fileURLToPath(import.meta.url))
const test = suite('exporter')
const options = {
    filemapper: {
        routesDir: { default: __dirname+'/example' }
    }
}

const instance = new Routify(options)

test('can build route tree', async () => {
    await filemapper({ instance })
    assert.is(instance.superNode.children[0].descendants.length, 7)
})

test('can export a route tree', async () => {
    await exporter(instance.superNode.children[0], __dirname+'/.routify')
})


test.run()