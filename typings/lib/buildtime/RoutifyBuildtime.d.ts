/**
 * @extends {Routify<typeof RNodeBuildtime>}
 */
export class RoutifyBuildtime extends Routify<typeof RNodeBuildtime> {
    /** @param {Partial<RoutifyBuildtimeOptions>} options */
    constructor(options: Partial<RoutifyBuildtimeOptions>);
    NodeConstructor: typeof RNodeBuildtime;
    mode: string;
    /** @type {RoutifyBuildtimePlugin[]} */
    plugins: RoutifyBuildtimePlugin[];
    /** @type {Function} */
    close: Function;
    /** @type {Object<string, RNodeBuildtime>} */
    rootNodes: {
        [x: string]: RNodeBuildtime;
    };
    options: Partial<Partial<RoutifyBuildtimeOptions>>;
    on: {
        buildStart: import("hookar").CollectionSyncVoid<any> | import("hookar").CollectionAsyncVoid<any>;
        buildComplete: import("hookar").CollectionSyncVoid<any> | import("hookar").CollectionAsyncVoid<any>;
        fileAdded: import("hookar").CollectionSyncVoid<any> | import("hookar").CollectionAsyncVoid<any>;
        fileRemoved: import("hookar").CollectionSyncVoid<any> | import("hookar").CollectionAsyncVoid<any>;
        fileChanged: import("hookar").CollectionSyncVoid<any> | import("hookar").CollectionAsyncVoid<any>;
        fileWatcherReady: import("hookar").CollectionSyncVoid<any> | import("hookar").CollectionAsyncVoid<any>;
    };
    /**
     *
     * @param {string} id filename
     * @param {string} content
     * @param {{cwd?: string}} options
     */
    writeFile(id: string, content: string, options?: {
        cwd?: string;
    }): Promise<void>;
    _build(trigger: any): Promise<void>;
    build(trigger: any): Promise<void>;
    start(): Promise<void>;
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
import { RNodeBuildtime } from './RNodeBuildtime.js';
import { Routify } from '../common/Routify.js';
