const decoratorDefaults = { recursive: true, shouldRender: () => true }

/**
 * @param {DecoratorInput} decorator
 * @returns {Decorator}
 */
export const normalizeDecorator = decorator => {
    if ('component' in decorator) return { ...decoratorDefaults, ...decorator }
    else return { ...decoratorDefaults, component: decorator }
}

export * from './normalizeMulti.js'
