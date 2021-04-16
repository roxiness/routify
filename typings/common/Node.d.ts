export class Node {
    constructor(name: any, instance: any);
    /** @type {Routify} */
    instance: Routify;
    /** @type {Node} */
    parent: Node;
    meta: {
        bundle: any;
    };
    /** @type {String} */
    component: string;
    /** @type {String} */
    id: string;
    name: any;
    /** @param {Node} child */
    appendChild(child: Node): void;
    get descendants(): Node[];
    remove(): void;
    get ancestors(): Node[];
    get root(): Node;
    get isRoot(): boolean;
    get children(): Node[];
    get map(): any;
}
import { Routify } from "./Routify.js";
