import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFile } from 'fs/promises'
import { flexMapsPlugin } from '../index.js'
import { filemapper } from '../../../lib/buildtime/plugins/filemapper/lib/index.js'
import { RoutifyBuildtime } from '../../../lib/buildtime/RoutifyBuildtime.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const nameAndPath = node => `${node.name} (${node.file.path})`

const options = {
    routifyDir: `${__dirname}/temp`,
    routesDir: {
        default: `${__dirname}/example`,
        basicOnly: `${__dirname}/example`,
        withPriorities: `${__dirname}/example`,
    },
}

describe('flexMap plugin', async () => {
    const instance = new RoutifyBuildtime(options)

    const [createRouteDirs, mergeVariantRoutes] = flexMapsPlugin({
        variationsMap: {
            basicOnly: ['en', 'en-us', 'de'],
            withPriorities: ['en-us,en', 'en', 'de'],
        },
    })

    describe('createRouteDirs', async () => {
        await createRouteDirs.build({ instance, tools: null })
        await filemapper({ instance })
        test('basic', () => {
            assert.ok(instance.options.routesDir['basicOnly_en'])
            assert.ok(instance.options.routesDir['basicOnly_de'])
        })
        test('withPriorities', () => {
            assert.ok(instance.options.routesDir['withPriorities_en-us'])
            assert.ok(instance.options.routesDir['withPriorities_en'])
            assert.ok(instance.options.routesDir['withPriorities_de'])
        })
    })

    describe('mergeVariantRoutes', async () => {
        await mergeVariantRoutes.build({ instance, tools: null })

        test('rootNodes', () => {
            assert.ok(instance.rootNodes.default)
            assert.ok(instance.rootNodes.basicOnly_en)
            assert.ok(instance.rootNodes.basicOnly_de)

            assert.ok(instance.rootNodes.withPriorities_en)
            assert.ok(instance.rootNodes['withPriorities_en-us'])
            assert.ok(instance.rootNodes.withPriorities_de)
        })

        test('default', () => {
            assert.deepEqual(instance.rootNodes.default.children.map(nameAndPath), [
                'about.de (plugins/flexMap/spec/example/about.de.svelte)',
                'about.en (plugins/flexMap/spec/example/about.en.svelte)',
                'about (plugins/flexMap/spec/example/about.svelte)',
                'index.de (plugins/flexMap/spec/example/index.de.svelte)',
                'index.en-us (plugins/flexMap/spec/example/index.en-us.svelte)',
                'index.en (plugins/flexMap/spec/example/index.en.svelte)',
                'index (plugins/flexMap/spec/example/index.svelte)',
                '[...404] (plugins/flexMap/spec/temp/components/[...404].svelte)',
            ])
        })

        test('basic_en', () => {
            assert.deepEqual(instance.rootNodes.basicOnly_en.children.map(nameAndPath), [
                'about (plugins/flexMap/spec/example/about.en.svelte)',
                'index (plugins/flexMap/spec/example/index.en.svelte)',
                '[...404] (plugins/flexMap/spec/temp/components/[...404].svelte)',
            ])
        })

        test('basic_de', () => {
            assert.deepEqual(instance.rootNodes.basicOnly_de.children.map(nameAndPath), [
                'about (plugins/flexMap/spec/example/about.de.svelte)',
                'index (plugins/flexMap/spec/example/index.de.svelte)',
                '[...404] (plugins/flexMap/spec/temp/components/[...404].svelte)',
            ])
        })

        test('withPriorities_en', () => {
            assert.deepEqual(
                instance.rootNodes.withPriorities_en.children.map(nameAndPath),
                [
                    'about (plugins/flexMap/spec/example/about.en.svelte)',
                    'index (plugins/flexMap/spec/example/index.en.svelte)',
                    '[...404] (plugins/flexMap/spec/temp/components/[...404].svelte)',
                ],
            )
        })

        test('withPriorities_en-us', () => {
            assert.deepEqual(
                instance.rootNodes['withPriorities_en-us'].children.map(nameAndPath),
                [
                    'about (plugins/flexMap/spec/example/about.en.svelte)',
                    'index (plugins/flexMap/spec/example/index.en-us.svelte)',
                    '[...404] (plugins/flexMap/spec/temp/components/[...404].svelte)',
                ],
            )
        })

        test('withPriorities_de', () => {
            assert.deepEqual(
                instance.rootNodes.withPriorities_de.children.map(nameAndPath),
                [
                    'about (plugins/flexMap/spec/example/about.de.svelte)',
                    'index (plugins/flexMap/spec/example/index.de.svelte)',
                    '[...404] (plugins/flexMap/spec/temp/components/[...404].svelte)',
                ],
            )
        })
    })
})
