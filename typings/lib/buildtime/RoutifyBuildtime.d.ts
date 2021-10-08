/**
 *  @extends {Routify<typeof import('./RNodeBuildtime')['RNodeBuildtime']>}
 **/
export class RoutifyBuildtime extends Routify<typeof RNodeBuildtime> {
    /** @param {Partial<RoutifyBuildtimeOptions>} options */
    constructor(options: Partial<RoutifyBuildtimeOptions>);
    /** @type {RoutifyBuildtimePlugin[]} */
    plugins: RoutifyBuildtimePlugin[];
    /** @type {Function} */
    close: Function;
    /** @type {options} */
    options: Partial<RoutifyBuildtimeOptions>;
    build: (trigger: any) => Promise<void>;
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
    start(): Promise<void>;
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
import { RNodeBuildtime } from "./RNodeBuildtime.js";
import { Routify } from "../common/Routify.js";
