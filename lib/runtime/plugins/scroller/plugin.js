import ScrollDecorator from './ScrollDecorator.svelte'
import { scrollQueue } from './ScrollQueue.js'

/** @returns {RoutifyRuntimePlugin} */
export default () => ({
    onMount: ({ context }) => {
        context.decorators.push(ScrollDecorator)
    },
    afterRouteRendered: ctx => !ctx.route.state.dontScroll && scrollQueue.processQueue(),
})
