import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { RoutifyBuildtime } from '../../../lib/RoutifyBuildtime.js'
import '../../../typedef.js'
import { createDirname } from '../../../lib/utils.js'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import fse from 'fs-extra'

const test = suite('bundles')

const __dirname = createDirname(import.meta)

test('can run routify with bundled plugins', async () => {
    const instance = new RoutifyBuildtime({
        routifyDir: resolve(__dirname, 'temp', '.routify'),
        filemapper: {
            routesDir: resolve(__dirname, 'example'),
        },
    })
    await instance.start()
    assertSnapshot(
        'routify',
        readFileSync(
            resolve(__dirname, 'temp', '.routify', 'routes.default.js'),
            'utf-8',
        ),
        0,
    )
    assertSnapshot(
        'bundles',
        readFileSync(
            resolve(
                __dirname,
                'temp',
                '.routify',
                'bundles',
                '_default_admin-bundle.js',
            ),
            'utf-8',
        ),
        0,
    )
})

test.run()

function assertSnapshot(name, content, update) {
    const filepath = `${__dirname}/fixtures/${name}.js`
    if (update) fse.outputFileSync(filepath, content)
    const expect = readFileSync(filepath, 'utf-8')
    assert.equal(content, expect)
}
