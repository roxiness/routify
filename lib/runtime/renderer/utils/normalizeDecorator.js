const decoratorDefaults = {
    recursive: true,
    shouldRender: () => true,
}
const wrapperDefaults = {
    recursive: false,
    shouldRender: ({ context }) => context.isInline,
}

/**
 * @param {DecoratorInput} decorator
 * @returns {Decorator}
 */
export const normalizeDecorator = decorator => {
    if ('component' in decorator) return { ...decoratorDefaults, ...decorator }
    else return { ...decoratorDefaults, component: decorator }
}

export const normalizeWrapper = wrapper => {
    if ('component' in wrapper) return { ...wrapperDefaults, ...wrapper }
    else return { ...wrapperDefaults, component: wrapper }
}

export * from './normalizeInline.js'
