import '../../typedef.js'
import { RNode } from '../common/RNode.js'

/**
 * @extends {RNode<RoutifyRuntime>}
 */
export class RNodeRuntime extends RNode {
    /** @type {Object.<string,RegExp>} */
    #regex = {}

    get regex() {
        const { name } = this
        if (!this.#regex[name])
            this.#regex[name] = this.instance.utils.getRegexFromName(this.name)
        return this.#regex[name]
    }

    // save to regex key so regex gets invalidated if name changes
    set regex(value) {
        this.#regex[this.name] = new RegExp(value)
    }

    async preload() {
        this.component = await this.component
    }
}
