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

test('can transform output files', async () => {
    const bundlePath = resolve(
        __dirname,
        'temp',
        '.routify-transform',
        'bundles',
        '_default_admin-bundle.js',
    )

    const baseInstance = new RoutifyBuildtime({
        routifyDir: resolve(__dirname, 'temp', '.routify-transform'),
        routesDir: resolve(__dirname, 'example'),
    })
    await baseInstance.start()

    let baseExpectedContent = readFileSync(bundlePath, 'utf-8')
    expect(baseExpectedContent).toMatchSnapshot('routify-transform')

    let ids = []

    const emptyTransformInstance = new RoutifyBuildtime({
        routifyDir: resolve(__dirname, 'temp', '.routify-transform'),
        routesDir: resolve(__dirname, 'example'),
        plugins: [
            {
                transform: (id, content) => {
                    ids.push(id)
                },
            },
        ],
    })

    await emptyTransformInstance.start()

    expect(ids[0]).toMatch(/_default_admin-bundle.js$/)
    expect(ids[1]).toMatch(/routes.default.js$/)
    expect(ids[2]).toMatch(/instance.default.js$/)

    const emptyTransformExpectedContent = readFileSync(bundlePath, 'utf-8')
    expect(emptyTransformExpectedContent).toEqual(baseExpectedContent)

    const transformInstance = new RoutifyBuildtime({
        routifyDir: resolve(__dirname, 'temp', '.routify-transform'),
        routesDir: resolve(__dirname, 'example'),
        plugins: [
            {
                transform: (id, content) => content + '\nhello',
            },
        ],
    })
    await transformInstance.start()
    const transformExpectedContent = readFileSync(bundlePath, 'utf-8')
    expect(transformExpectedContent).toEqual(baseExpectedContent + '\nhello')
})
