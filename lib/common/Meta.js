import '#root/typedef.js'

/**
 * Proxies meta
 * @type {ProxyHandler<Meta>}
 **/
const metaProxy = {
    /**
     * Returns property value from the meta or from its nearest ancestor
     * where the `|scoped` directive has been used
     */
    get: function (target, prop, receiver) {
        if (typeof target[prop] !== 'undefined') return target[prop]

        let node = target._node
        while ((node = node.parent)) {
            if (
                node.meta &&
                node.meta._directives[prop] &&
                node.meta._directives[prop].includes('scoped')
            ) {
                return node.meta[prop]
            }
        }
        return undefined
    },
    set(target, prop, value) {
        const isRuntime =
            target._node.instance &&
            target._node.instance.constructor.name === 'RoutifyRuntime'

        prop = prop.toString()
        const [name, ...directives] = prop.split('|')

        if (directives.length) target._directives[name] = directives

        if (isRuntime && directives.includes('split')) {
            Object.defineProperty(target, name, {
                get: value,
                enumerable: true,
            })
        } else target[name] = value
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
            _directives: { enumerable: false, value: {} },
        })
        return new Proxy(this, metaProxy)
    }
    _directives = {}
    _node = {}

    /**
     * converts { key: "value": "fn": x => x }
     * to {
     *   "key|directive1|directive2": "value",
     *   "fn": "x => x::_EVAL"
     * }
     */
    toJSON() {
        return Object.entries(this).reduce((map, [key, val]) => {
            if (this._directives[key])
                key = [key, ...this._directives[key]].join('|')
            if (typeof val === 'function') map[key] = val.toString() + '::_EVAL'
            else map[key] = val
            return map
        }, {})
    }
}
