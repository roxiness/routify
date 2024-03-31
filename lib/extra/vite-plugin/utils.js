import fse from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = fileURLToPath(dirname(import.meta.url))

export async function getSpank() {
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

export const stripLogs = async (id, code) =>
    id.match(/routify3?\/lib/) &&
    code
        .replace(/\/\/ *routify-dev-only-start[\s\S]+?\/\/ *routify-dev-only-end/gim, '')
        .replace(/.+ \/\/ *routify-dev-only/gi, '')

export const optionsCheck = (options, isProduction) => {
    const depprecationNote =
        '⚠️  The old option will be removed in the stable release of Routify 3.0.0. Please use the new option.'
    const msg = _msg => `⚠️  [Routify-vite-plugin] ${_msg}`
    const deprecationMsg = _msg => msg(`${_msg}\n${depprecationNote}`)

    if (options['ssr']?.['prerender']) {
        console.log(deprecationMsg(`"ssr.prerender has moved to "render.ssg"`))
    }
    if (options['ssr']?.['spank']) {
        console.log(deprecationMsg(`"ssr.spank" has moved to "render.ssg.spank"`))
    }
    if (options['ssr']) {
        console.log(deprecationMsg(`"ssr" has moved to "render.ssr"`))
    }

    if (
        isProduction &&
        !options.render.ssr.enable &&
        !options.render.ssg.enable &&
        !options.render.csr.enable
    )
        throw new Error(msg('At least one of the render options must be enabled'))
}

/**
 * @param {Partial<VitePluginOptions>=} options
 */
export const postSsrBuildProcess = async options => {
    const type = options.render.ssr.type
    fse.copySync(__dirname + `/assets/${type}Renderer.js`, 'dist/server/serve.js')

    if (type === 'cjs') fse.writeFileSync('dist/server/package.json', '{}')

    fse.moveSync('dist/client/index.html', 'dist/server/index.html', { overwrite: true })

    if (options.render.ssg.enable) {
        const spank = await getSpank()
        await spank.start(options.render.ssg.spank)
    }

    if (!options.render.ssr.enable) {
        fse.removeSync('dist/server')
    }
}

/**
 *
 * @param {Partial<VitePluginOptionsInput>} input
 * @param {boolean} isProduction
 * @returns {VitePluginOptions}
 */
export const normalizeOptions = (input = {}, isProduction) => {
    const formatInput = input => (typeof input === 'boolean' ? { enable: input } : input)

    return /** @type {VitePluginOptions} */ ({
        ...input,
        watch: input.watch ?? !isProduction,
        run: input.run ?? true,
        render: {
            csr: { enable: true, ...formatInput(input.render?.csr) },
            ssg: { enable: false, spank: {}, ...formatInput(input.render?.ssg) },
            ssr: { enable: false, type: 'esm', ...formatInput(input.render?.ssr) },
        },
    })
}
