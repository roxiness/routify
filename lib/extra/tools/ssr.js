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
 * @param {string} compositeUrl one or multiple urls separated by ";<routerName>="
 * @returns
 */
export const renderModule = async (module, compositeUrl) => {
    await polyfillFetch()
    const render = module.default?.render || module['render']

    // const urlPairs = getUrlSegments(compositeUrl)
    // const load = module.load ? await module.load(getPrimaryUrl(urlPairs)) : {}
    // await preloadUrlFromUrlPairs(urlPairs)
    await preloadUrl(compositeUrl)
    return { ...(await render()), status: 200 }
}
