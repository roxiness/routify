import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { RoutifyBackend } from '../../../lib/RoutifyBackend.js'
import '../../../typedef.js'
import { createDirname } from '../../../common/utils.js'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import fse from 'fs-extra'

const test = suite('routify')

const __dirname = createDirname(import.meta)

test('can run routify with bundled plugins', async () => {
    const instance = new RoutifyBackend({
        routifyDir: resolve(__dirname, '.routify'),
        filemapper: {
            routesDir: resolve(__dirname, 'example'),
        },
    })
    await instance.start()
    assertSnapshot(
        'routify',
        readFileSync(
            resolve(__dirname, '.routify', 'routes.default.js'),
            'utf-8',
        ),
        0,
    )
    assertSnapshot(
        'bundles',
        readFileSync(
            resolve(
                __dirname,
                '.routify',
                'bundles',
                '_default_admin-bundle.js',
            ),
            'utf-8',
        ),
        0,
    )
})

/*
    todo temporarily enabled
    Test disabled due to this issue: https://github.com/lukeed/uvu/issues/110
    When this is fixed or a workaround is found, please uncomment
*/
test.run()

function assertSnapshot(name, content, update) {
    const filepath = `${__dirname}/fixtures/${name}.js`
    if (update) fse.outputFileSync(filepath, content)
    const expect = readFileSync(filepath, 'utf-8')
    assert.equal(content, expect)
}
