import _transition from './TransitionComponent.svelte'

/** @typedef {import('./transition.types.js').TransitionConfig} TransitionConfig */

/** @type {Decorator<Partial<{config: Partial<TransitionConfig>}>>} */
const defaults = {
    component: _transition,
    order: -1,
    recursive: false,
    props: { config: { axis: 'y' } },
}

/**
 * @param {Partial<TransitionConfig>} config
 * @param {Partial<Decorator<Partial<{config: Partial<TransitionConfig>}>>>} decorator
 * @returns {Decorator<Partial<{config: Partial<TransitionConfig>}>>}
 */
export const transition = (config = {}, decorator = {}) => ({
    ...defaults,
    ...decorator,
    props: {
        ...defaults.props,
        ...decorator.props,
        config: { ...defaults.props.config, ...decorator.props?.config, ...config },
    },
})
