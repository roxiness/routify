import ScrollDecorator from './ScrollDecorator.svelte'

/** @returns {RoutifyRuntimePlugin} */
export default () => ({
    onMount: ({ router, context }) => {
        context.decorators.push(ScrollDecorator)
    },
})
