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
    options: Partial<Partial<RoutifyBuildtimeOptions>>;
    build(trigger: any): Promise<void>;
    on: {
        buildStart: any;
        buildComplete: any;
        fileAdded: any;
        fileRemoved: any;
        fileChanged: any;
        fileWatcherReady: any;
    };
    writeFile(id: any, content: any): Promise<void>;
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
import { RNodeBuildtime } from "./RNodeBuildtime.js";
import { Routify } from "../common/Routify.js";
