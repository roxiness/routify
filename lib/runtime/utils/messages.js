export const noRoutesMapProvided = name =>
    `No routesMap provided. Make sure you\'ve either created a router for the '${name}' route or provided a routesMap`

export const handleRebuildError = (context, childContexts) => {
    console.warn('Failed to rebuild routes', { context, childContexts })
    const msg =
        'Infinite loop detected while trying to compose components. This is likely an error in Routify.'
    const err = new Error(msg)

    throw err
}
