/**
 * @template {typeof import('svelte/internal').SvelteComponentDev} C
 * @param {C} Component
 * @param {Object.<string, any>} props
 * @returns {C}
 */
export const attachProps = (Component, props, defaults) => {
    // @ts-ignore
    return function (options) {
        options.props = {
            ...defaults,
            ...options.props,
            ...props,
        }
        return new Component(options)
    }
}

export * from './normalizeMulti.js'
