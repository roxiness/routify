import { get, writable } from 'svelte/store'
import { scrollIsIdle } from './util'
import '../../../../typedef.js'

const isScrolling = writable(false)

/**
 * runs after each navigation
 * @param {import('svelte/store').Readable<Route>} activeRoute
 * @param {*} history
 * @returns
 */
const run = (activeRoute, history) => {
    const [path, hash] = get(activeRoute).url.split('#')
    const [prevPath, _prevHash] = history[0]?.url.split('#') || []
    if (!hash) return

    const scroll = async event => {
        const samePath = path === prevPath
        const elem = document.getElementById(hash)
        if (elem) elem.scrollIntoView({ behavior: samePath ? 'smooth' : 'auto' })

        if (samePath && elem) {
            isScrolling.set(true)
            await scrollIsIdle()
            isScrolling.set(false)
        }
        if (!samePath && !event) {
            // reset page scroll to hash location on every page mutation
            // for 500 ms to avoid load jitters
            const observer = new MutationObserver(scroll)
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true,
            })
            setTimeout(observer.disconnect.bind(observer), 500)
        }
    }

    scroll()
}

export const scrollHandler = { isScrolling, run }
