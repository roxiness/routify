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
export class Meta<Node extends import("../runtime/Instance/RNodeRuntime").RNodeRuntime | import("./RNode").RNode<any>> {
    /** @param {Node} node */
    constructor(node: Node);
    _props: {};
    /** @type {Node} */
    _node: Node;
}
