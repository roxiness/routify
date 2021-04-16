/**
 * @typedef {Object} RoutifyOptions
 * @prop {string} routifyDir
 * @prop {Partial<FilemapperOptions>} filemapper
 * @prop {(RoutifyPlugin|string)[]} plugins
 */
/**
 * @typedef {Object} FilemapperOptions
 * @prop {String[]} moduleFiles
 * @prop {String[]} resetFiles
 * @prop {Object<string, string>|string} routesDir
 */
export class Routify {
    /** @param {Partial<RoutifyOptions>} options */
    constructor(options: Partial<RoutifyOptions>);
    /** @type {RoutifyOptions} */
    options: RoutifyOptions;
    /** @type {Node[]} */
    nodeIndex: Node[];
    createNode(name: any): Node;
    superNode: Node;
    /** @type {RoutifyPlugin[]} */
    plugins: RoutifyPlugin[];
    start(): Promise<void>;
}
export type RoutifyOptions = {
    routifyDir: string;
    filemapper: Partial<FilemapperOptions>;
    plugins: (RoutifyPlugin | string)[];
};
export type FilemapperOptions = {
    moduleFiles: string[];
    resetFiles: string[];
    routesDir: {
        [x: string]: string;
    } | string;
};
import { Node } from "./Node.js";
