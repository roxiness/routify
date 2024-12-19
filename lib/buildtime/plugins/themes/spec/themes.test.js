import { dirname } from 'path'
import { fileURLToPath } from 'url'
import fse from 'fs-extra'
import { filemapper } from '../../../../buildtime/plugins/filemapper/lib/index.js'
import { RoutifyBuildtime } from '../../../../buildtime/RoutifyBuildtime.js'
import { themes } from '../themes.js'
import { normalizeConfig, normalizePreset } from '../utils.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const options = {
    routifyDir: `${__dirname}/temp`,
    routesDir: { default: `${__dirname}/example` },
}

beforeEach(() => {
    fse.emptyDirSync(options.routifyDir)
})

describe('theme config', () => {
    test('presets', () => {
        const defaultPreset = {
            preferences: [],
            namespaces: [/^@_/],
            rootNodes: [],
        }
        test('can handle shorthand ', () => {
            const input = [['de', 'xmas'], 'de']
            const expected = {
                rootNodes: [],
                namespaces: [/^@_/],
                preferences: [['de', 'xmas'], ['de']],
            }

            const normalizedPreset = normalizePreset(input, defaultPreset)
            expect(normalizedPreset).toEqual(expected)
        })

        test('can handle full preset', () => {
            const input = {
                preferences: [['de', 'xmas'], ['de']],
                namespaces: ['foo'],
                rootNodes: ['blog'],
            }

            const normalizedPreset = normalizePreset(input, defaultPreset)
            expect(normalizedPreset).toEqual(input)
        })
    })
    test('config', () => {
        test('no defaults', () => {
            const input = { presets: { at: [['at', 'xmas'], 'at'] } }

            const normalizedConfig = normalizeConfig(input, [])
            expect(normalizedConfig).toEqual({
                presets: {
                    at: {
                        rootNodes: [],
                        namespaces: [/^@_/],
                        preferences: [['at', 'xmas'], ['at']],
                    },
                },
                defaults: {
                    file: 'en',
                    app: 'en',
                    namespaces: [/^@_/],
                    rootNodes: [],
                },
            })
        })
        test('with defaults', () => {
            const input = {
                presets: { at: [['at', 'xmas'], 'at'] },
                defaults: { file: 'de', namespaces: ['foo'] },
            }

            const normalizedConfig = normalizeConfig(input, [])
            expect(normalizedConfig).toEqual({
                presets: {
                    at: {
                        rootNodes: [],
                        namespaces: ['foo'],
                        preferences: [['at', 'xmas'], ['at']],
                    },
                },
                defaults: {
                    file: 'de',
                    app: 'en',
                    namespaces: ['foo'],
                    rootNodes: [],
                },
            })
        })
    })
})

describe('themes', async () => {
    const themeConfig = {
        presets: {
            'at-xmas': [['at', 'xmas'], ['de', 'xmas'], 'at', 'de', ['en', 'xmas'], 'en'],
            at: ['at', 'de', 'en'],
            'de-xmas': [['de', 'xmas'], 'de', ['en', 'xmas'], 'en'],
            de: ['de', 'en'],
            'en-xmas': [['en', 'xmas'], 'en'],
            en: ['en'],
        },
    }
    const instance = new RoutifyBuildtime({ ...options, themes: themeConfig })
    await filemapper({ instance })
    await themes({ instance })

    test('creates themed root nodes', () => {
        // Object.entries(instance.rootNodes).forEach(([name, rootNode]) => {
        //     console.log('THEME: ' + name)
        //     // console.log(rootNode)
        //     visualNodeTree(rootNode)
        // })
        expect(instance.rootNodes['default-theme-at-xmas']).toBeTruthy()
        expect(instance.rootNodes['default-theme-de-xmas']).toBeTruthy()
        expect(instance.rootNodes['default-theme-en-xmas']).toBeTruthy()
        expect(instance.rootNodes['default-theme-at']).toBeTruthy()
        expect(instance.rootNodes['default-theme-de']).toBeTruthy()
        expect(instance.rootNodes['default-theme-en']).toBeTruthy()
        expect(instance.rootNodes['default']).toBeTruthy()
    })

    test('can have nested folders in a theme', () => {
        const node = instance.rootNodes['default-theme-at-xmas'].traverse('/blog/index')
        expect(node).toBeTruthy()
        expect(node.id).toBe('_default___lang__at_blog_index_svelte')
        expect(node.file.dir).toEqual(
            'lib/buildtime/plugins/themes/spec/example/@_lang/@at/blog',
        )
    })

    test('themes can be nested in folders', () => {
        const node = instance.rootNodes['default-theme-de-xmas'].traverse('/blog/index')
        expect(node).toBeTruthy()
        expect(node.id).toBe('_default_blog__de_index_svelte')
        expect(node.file.dir).toEqual(
            'lib/buildtime/plugins/themes/spec/example/blog/@de',
        )
    })

    test('themes can have precedence', () => {
        const indexNode = instance.rootNodes['default-theme-at-xmas'].traverse('/index')
        expect(indexNode.file.dir).toEqual(
            'lib/buildtime/plugins/themes/spec/example/@_lang/@de/@xmas',
        )

        const blogNode =
            instance.rootNodes['default-theme-at-xmas'].traverse('/blog/index')
        expect(blogNode.file.dir).toEqual(
            'lib/buildtime/plugins/themes/spec/example/@_lang/@at/blog',
        )
    })

    test('unwanted themes are excluded', () => {
        const yes = instance.rootNodes['default-theme-de-xmas'].traverse('/dexmasonly')
        const no = instance.rootNodes['default-theme-de'].traverse('/dexmasonly', {
            silent: true,
        })
        expect(yes).toBeTruthy()
        expect(no).toBeFalsy()
    })
})

describe('themes can be built', async () => {
    const themeConfig = {
        presets: {
            'at-xmas': [['at', 'xmas'], ['de', 'xmas'], 'at', 'de', ['en', 'xmas'], 'en'],
            at: ['at', 'de', 'en'],
            'de-xmas': [['de', 'xmas'], 'de', ['en', 'xmas'], 'en'],
            de: ['de', 'en'],
            'en-xmas': [['en', 'xmas'], 'en'],
            en: ['en'],
        },
    }
    const instance = new RoutifyBuildtime({ ...options, themes: themeConfig })
    await instance.build()
})

const visualNodeTree = (node, depth = 0) => {
    const indent = '  '.repeat(depth)
    console.log(`${indent}${node.name} - ${node.meta.__themesPlugin_themes?.join(', ')}`)
    node.children.forEach(child => visualNodeTree(child, depth + 1))
}
