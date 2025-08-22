const decoratorDefaults = {
    recursive: true,
    shouldRender: () => true,
    order: 0,
}
const wrapperDefaults = {
    recursive: false,
    shouldRender: ({ context }) => context.isInline,
}

/**
 * @template T
 * @param {DecoratorInput<T>} decorator
 * @returns {Decorator<T>}
 */
export const normalizeDecorator = decorator => {
    // @ts-ignore
    if ('component' in decorator) return { ...decoratorDefaults, ...decorator }
    // @ts-ignore
    else return { ...decoratorDefaults, component: decorator }
}

export const normalizeWrapper = wrapper => {
    if ('component' in wrapper) return { ...wrapperDefaults, ...wrapper }
    else return { ...wrapperDefaults, component: wrapper }
}

export * from './normalizeInline.js'
