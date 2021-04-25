// import '../typedef.js'

/** @type {ProxyHandler<Meta>} */
const metaProxy = {
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
        prop = prop.toString()
        const [name, ...directives] = prop.split('|')

        if (directives.length) target._directives[name] = directives

        target[name] = value
        return true
    },
}

/**
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
     *   "_EVAL::fn": "x => x"
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
