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

/**
 * @param {Partial<VitePluginOptions>=} options
 */
export const postSsrBuildProcess = async options => {
    const type = options.ssr.type
    fse.copySync(__dirname + `/assets/${type}Renderer.js`, 'dist/server/serve.js')

    if (type === 'cjs') fse.writeFileSync('dist/server/package.json', '{}')

    fse.moveSync('dist/client/index.html', 'dist/server/index.html', { overwrite: true })

    if (options.ssr.prerender) {
        const spank = await getSpank()
        await spank.start(options.ssr.spank)
    }
}
