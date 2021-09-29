/**
 * Proxies meta
 * @type {ProxyHandler<Meta>}
 **/
const metaProxy = {
    ownKeys: target => {
        return Object.keys(target._props)
    },

    getOwnPropertyDescriptor: (target, key) => ({
        value: target[key],
        enumerable: true,
        configurable: true,
    }),

    /**
     * Returns property value from the meta or from its nearest ancestor
     * where the `scoped` directive has been used
     */
    get: function (target, prop, receiver) {
        const isRuntime = target._node?.instance?.mode === 'runtime'

        if (Reflect.has(target, prop)) return Reflect.get(target, prop)

        const metaProp = target._props[prop]
        if (typeof metaProp !== 'undefined')
            return metaProp.split && isRuntime ? metaProp.value() : metaProp.value
        let node = target._node
        while ((node = node.parent))
            if (node.meta?._props?.[prop]?.scoped) return node.meta[prop]
        return undefined
    },
    set(target, prop, value) {
        const metaProp = typeof value?.value !== 'undefined' ? value : { value }

        prop = prop.toString()

        const [name, obj] = convertDirectivesToProps(prop)
        Object.assign(metaProp, obj)

        // if we're overwriting existing meta prop, we want to keep meta metadata like `scoped`
        target._props[name] = Object.assign(target._props[name] || {}, metaProp)

        return true
    },
}

/**
 * Meta class returns value from self as well as scoped values from parent nodes.
 * Scoped values are set with the `scoped` directive. Example meta['myprop|scoped'] = value
 * Directives (meta['key|directive'] = value) are stripped a
 *
 * @example <caption>foobar</caption>
 * // setting a scoped value
 * node.meta['myKey|scoped'] = value
 * // scoped values can be retrieved by current meta as well as descendant metas
 * node.meta.myKey === node.descendants[0].meta.myKey
 * @template {RNode|RNodeRuntime} Node
 */
export class Meta {
    /** @param {Node} node */
    constructor(node) {
        Object.defineProperties(this, {
            _node: { enumerable: false, value: node },
        })
        return new Proxy(this, metaProxy)
    }
    _props = {}
    /** @type {Node} */
    _node = {}
}

/**
 * converts ('foo|bar("hello")|baz' )
 * to
 * [ 'foo', { bar: 'hello', baz: true } ]
 * @param {Object.<string,string>} meta
 */
const convertDirectivesToProps = prop => {
    const [name, ...directives] = prop.split('|')
    const obj = directives.reduce((acc, cur) => {
        const match = cur.match(/(.+?)(\((.+)\))?$/)
        acc[cur] = true
        return acc
    }, {})
    return [name, obj]
}
