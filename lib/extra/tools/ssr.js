import { SvelteComponentDev } from 'svelte/internal'
import { preloadUrl } from '../../runtime'

const polyfillFetch = async () => {
    const fetch = await import('node-fetch')

    // @ts-ignore
    globalThis.fetch = fetch.default
    // @ts-ignore
    globalThis.Headers = fetch.Headers
    // @ts-ignore
    globalThis.Request = fetch.Request
    // @ts-ignore
    globalThis.Response = fetch.Response
}

/**
 * Returns a statically rendered Routify app
 * @param {(SvelteComponentDev|{default: SvelteComponentDev}) & {load: (url:string)=>Promise<any>}} module App.svelte
 * @param {string | string[] | import('../../runtime').PreloadOptions=} urlOrOptions one or multiple urls separated by ";<routerName>="
 * @returns
 */
export const renderModule = async (module, urlOrOptions) => {
    await polyfillFetch()
    const render = module.default?.render || module['render']

    const url = urlOrOptions.url || urlOrOptions
    const load = module.load ? await module.load(url) : {}

    await preloadUrl(urlOrOptions)
    return { status: 200, ...(await render()), ...load }
}
