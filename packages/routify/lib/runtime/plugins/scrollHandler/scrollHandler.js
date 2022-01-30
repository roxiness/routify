import { writable } from 'svelte/store'
import { globalInstance } from '../../index.js'
import { scrollIsIdle } from './util.js'

/**
 *
 * @param {Element} elem
 */
const isParentToARouter = elem =>
    globalInstance.routers.find(router => router.parentElem === elem)

const createScrollHandler = () => {
    const isScrolling = writable(false)

    /**
     * runs after each navigation
     * @type {AfterUrlChangeCallback}
     */
    const run = ({ route, history, ...rest }) => {
        const [path, hash] = route.url.split('#')
        const [prevPath, _prevHash] = history[0]?.url.split('#') || []

        const softScroll = async shouldObserve => {
            const samePath = path === prevPath
            const elem = document.getElementById(hash)
            if (elem) elem.scrollIntoView({ behavior: samePath ? 'smooth' : 'auto' })

            if (samePath && elem) {
                isScrolling.set(true)
                await scrollIsIdle()
                isScrolling.set(false)
            }
            if (!samePath && shouldObserve) {
                // reset page scroll to hash location on every page mutation
                // for 500 ms to avoid load jitters
                const observer = new MutationObserver(() => softScroll())
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    characterData: true,
                })
                setTimeout(observer.disconnect.bind(observer), 500)
            }
        }

        /**
         * @param {Element} element
         */
        const resetScroll = element => {
            if (element) {
                element.scrollTop = 0
                const parent = element.parentElement
                if (
                    parent &&
                    parent.scrollTo &&
                    parent?.dataset['routify-scroll'] !== 'lock' &&
                    !isParentToARouter(parent)
                )
                    resetScroll(element.parentElement)
            }
        }

        if (hash) softScroll(true)
        else resetScroll(route.router.parentElem)
    }

    return { isScrolling, run }
}

export { createScrollHandler }
