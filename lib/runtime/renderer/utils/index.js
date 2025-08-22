// todo move attachProps to generic utils

/**
 * Attaches props to a Svelte component
 * @example
 * import MyComponent from './MyComponent.svelte'
 * const MyComponentWithProps = attachProps(MyComponent, {msg: 'hello world'})
 * @template {typeof import('svelte').SvelteComponent} C
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

/**
 * @param {RenderContext} context
 */
export const getLineage = context => {
    const contexts = []
    while (context) {
        contexts.push(context)
        context = context.parentContext
    }
    return contexts
}
