// todo move attachProps to generic utils

/**
 * Attaches props to a Svelte component
 * @example
 * import MyComponent from './MyComponent.svelte'
 * const MyComponentWithProps = attachProps(MyComponent, {msg: 'hello world'})
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
