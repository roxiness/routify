import { RoutifyBuildtime } from '../../../lib/buildtime/RoutifyBuildtime.js'
import { createDirname } from '../../../lib/buildtime/utils.js'
import { resolve } from 'path'
import { readFileSync } from 'fs'

const __dirname = createDirname(import.meta)

test('can run routify with bundled plugins', async () => {
    const instance = new RoutifyBuildtime({
        routifyDir: resolve(__dirname, 'temp', '.routify'),
        routesDir: resolve(__dirname, 'example'),
    })
    await instance.start()
    expect(
        readFileSync(
            resolve(__dirname, 'temp', '.routify', 'routes.default.js'),
            'utf-8',
        ),
    ).toMatchSnapshot('routify')

    expect(
        readFileSync(
            resolve(__dirname, 'temp', '.routify', 'bundles', '_default_admin-bundle.js'),
            'utf-8',
        ),
    ).toMatchSnapshot('bundles')
})
