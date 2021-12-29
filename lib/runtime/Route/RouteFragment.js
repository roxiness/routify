import { URIDecodeObject } from './utils'

export class RouteFragment {
    /**
     * @param {Route} route the route this fragment belongs to
     * @param {RNodeRuntime} node the node that corresponds to the fragment
     * @param {String} urlFragment a fragment of the url (fragments = url.split('/'))
     */
    constructor(route, node, urlFragment) {
        this.route = route
        this.node = node
        /** @type {RoutifyLoadReturn} */
        this.load = undefined
        this.urlFragment = urlFragment

        Object.defineProperty(this, 'route', { enumerable: false })
    }

    /** @type {Object.<string, string|string[]>} */
    _params = {}

    get params() {
        return this._params
    }

    setParams(params) {
        this._params = URIDecodeObject(params)
    }

    getParamsFromFragment() {
        const { getFieldsFromName, getValuesFromPath, mapFieldsWithValues } =
            this.route.router.instance.utils

        return mapFieldsWithValues(
            getFieldsFromName(this.node.name),
            getValuesFromPath(this.node.regex, this.urlFragment),
        )
    }
}
