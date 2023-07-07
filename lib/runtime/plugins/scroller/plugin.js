import ScrollDecorator from './ScrollDecorator.svelte'
import { scrollQueue } from './ScrollQueue'

/** @returns {RoutifyRuntimePlugin} */
export default () => ({
    onMount: ({ context }) => {
        context.decorators.push(ScrollDecorator)
    },
})
