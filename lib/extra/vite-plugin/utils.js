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
