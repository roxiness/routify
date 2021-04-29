export class RouteFragment {
    /**
     * @param {Route} route the route this fragment belongs to
     * @param {RNodeRuntime} node the node that corresponds to the fragment
     * @param {String} urlFragment a fragment of the url (fragments = url.split('/'))
     */
    constructor(route, node, urlFragment) {
        this.route = route
        this.node = node
        this.urlFragment = urlFragment
    }

    get params() {
        const {
            getFieldsFromName,
            getValuesFromPath,
            mapFieldsWithValues,
        } = this.route.router.instance.utils

        return mapFieldsWithValues(
            getFieldsFromName(this.node.name),
            getValuesFromPath(this.node.regex, this.urlFragment),
        )
    }
}
