import { createScrollHandler } from './scrollHandler.js'

/** @type {RoutifyRuntimePlugin} */
const plugin = {
    beforeRouterInit: ({ router }) => {
        const { isScrolling, run } = createScrollHandler()
        router.afterUrlChange(run)
        router['scrollHandler'] = { isScrolling }
    },
}

export default plugin
