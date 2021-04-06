import { Node } from "./Node.js";

export class Routify {
    constructor(options) {
        this.options = options
    }
    nodeIndex = []
    createNode(name) {
        return new Node(name, this)
    }
}