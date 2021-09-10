export class RoutifyBuildtime {
    /** @param {Partial<RoutifyBuildtimeOptions>} options */
    constructor(options: Partial<RoutifyBuildtimeOptions>);
    mode: string;
    Node: typeof RNode;
    superNode: RNode<RoutifyBuildtime>;
    get nodeIndex(): RNode<RoutifyBuildtime>[];
    /**
     * @param {string} name
     * @param {string|any} module
     * @returns {RNode<this>}
     */
    createNode(name: string, module: string | any): RNode<RoutifyBuildtime>;
    options: any;
    build: () => Promise<void>;
    on: {
        buildStart: {
            (cb: any): () => void;
            callbacks: any[];
            runHooks(attr: any): void;
        };
        buildComplete: {
            (cb: any): () => void;
            callbacks: any[];
            runHooks(attr: any): void;
        };
        fileAdded: {
            (cb: any): () => void;
            callbacks: any[];
            runHooks(attr: any): void;
        };
        fileRemoved: {
            (cb: any): () => void;
            callbacks: any[];
            runHooks(attr: any): void;
        };
        fileChanged: {
            (cb: any): () => void;
            callbacks: any[];
            runHooks(attr: any): void;
        };
        fileWatcherReady: {
            (cb: any): () => void;
            callbacks: any[];
            runHooks(attr: any): void;
        };
    };
    plugins: any[];
    start: () => Promise<void>;
    #private;
}
export type RoutifyOptions = {
    routifyDir: string;
    routesDir: {
        [x: string]: string;
    } | string;
    filemapper: Partial<FilemapperOptions>;
};
export type FilemapperOptions = {
    moduleFiles: string[];
    resetFiles: string[];
};
import { RNode } from "../common/RNode.js";
