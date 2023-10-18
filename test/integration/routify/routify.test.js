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
            resolve(__dirname, 'temp', '.routify', 'bundles', 'bundle-_default_admin.js'),
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
        'bundle-_default_admin.js',
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

    const filenames = ids.map(id => id.replace(/.+[\\/]/g, ''))
    const expectedFilenames = [
        'bundle-_default_admin.js',
        'routes.default.js',
        'render.js',
        'routify-init.js',
        'route-map.js',
        'instance.default.js',
        'sitemap.default.txt',
    ]
    assert.deepEqual(filenames, expectedFilenames)

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
