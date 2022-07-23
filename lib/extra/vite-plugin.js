import { RoutifyBuildtime } from '../buildtime/RoutifyBuildtime.js'
import fse from 'fs-extra'

const isProduction = process.env.NODE_ENV === 'production'

// not sure why Vite/Kit runs buildStart multiple times
let buildCount = 0
let isSsr = false

/**
 * @typedef {Object} VitePluginOptions
 * @prop {Boolean} run run Routify
 * @prop {Boolean} forceLogging force logging in production
 * @prop {any} ssr
 */

/**
 * @param {Partial<RoutifyBuildtimeOptions & VitePluginOptions>=} options
 * @returns
 */
export default function RoutifyPlugin(options = {}) {
    options.watch = options.watch ?? !isProduction
    options.run = options.run ?? true
    options.ssr = options.ssr ?? {}

    return {
        name: 'routify-plugin',

        buildStart: async () => {
            if (options.run && !buildCount++) {
                const routify = new RoutifyBuildtime(options)
                await routify.start()
            }
            return null
        },

        config: cfg => {
            isSsr = cfg.build?.ssr
            return {
                server: {
                    fs: {
                        strict: false,
                        allow: ['./.routify'],
                    },
                },
                build: {
                    ssr: cfg.build?.ssr === true ? 'src/App.svelte' : cfg.build?.ssr,
                    outDir: cfg.build?.ssr ? 'dist/server' : 'dist/client',
                    polyfillDynamicImport: false,
                },
            }
        },

        closeBundle: async () => {
            if (!isSsr) return
            fse.writeFileSync('dist/server/package.json', '{}')
            fse.writeFileSync('dist/server/serve.js', getRenderStr())
            fse.copySync('dist/client/index.html', 'dist/server/index.html', {
                overwrite: true,
            })
            const spank = await getSpank()
            await spank.start(options.ssr.spank)
        },

        transform: (code, id) =>
            isProduction &&
            !options.forceLogging &&
            id.match(/routify3?\/lib/) &&
            code
                .replace(
                    /\/\/ *routify-dev-only-start[\s\S]+?\/\/ *routify-dev-only-end/gim,
                    '',
                )
                .replace(/.+ \/\/ *routify-dev-only/gi, ''),
    }
}

async function getSpank() {
    try {
        // todo, remove ts-ignore when moving vite plugin to separate package
        // @ts-ignore
        const spank = await import('spank')
        return spank
    } catch (err) {
        console.log('[Routify] Could not import "spank".')
        console.log('[Routify] If you have not installed spank, please run:')
        console.log('[Routify] npm install spank')
        throw err
    }
}

function getRenderStr() {
    return (
        "const { readFileSync } = require('fs')\r\n" +
        "const app = require('./App.js')\r\n" +
        '\r\n' +
        "const template = readFileSync(__dirname + '/index.html', 'utf8')\r\n" +
        '\r\n' +
        "const render = async (path = '/') => {\r\n" +
        '    await app.load?.call(path)\r\n' +
        '    const render = app.default.render()\r\n' +
        '    const html = template\r\n' +
        "        .replace('<!--ssr:html-->', render.html)\r\n" +
        "        .replace('<!--ssr:head-->', render.head)\r\n" +
        "        .replace('<!--ssr:css-->', render.css.code)\r\n" +
        '    return html\r\n' +
        '}\r\n' +
        '\r\n' +
        'const path = process.argv[2]\r\n' +
        'if (path) render(path).then(html => console.log(html))\r\n' +
        '\r\n' +
        'module.exports = { render }\r\n'
    )
}

const flattenNodes = node => [node, ...node.children.map(flattenNodes).flat()]
