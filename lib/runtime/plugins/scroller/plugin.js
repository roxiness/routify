import ScrollDecorator from './ScrollDecorator.svelte'
import { scrollQueue } from './ScrollQueue.js'

/** @returns {RoutifyRuntimePlugin} */
export default () => ({
    onMount: ({ context }) => {
        context.decorators.push(ScrollDecorator)
    },
    afterRouteRendered: () => scrollQueue.processQueue(),
})
