/// <reference types="svelte/types/runtime/ambient" />
/**
 * @sveltech/routify 0.0.0-development
 * File generated Tue Apr 14 2020 09:23:45 GMT+0200 (GMT+02:00)
 */
export const __version: "0.0.0-development";
export const __timestamp: "2020-04-14T07:23:45.459Z";
export const options: {};
export namespace _tree {
    export const name: string;
    export const filepath: string;
    export const root: boolean;
    export const children: {
        isFile: boolean;
        isDir: boolean;
        ext: string;
        isLayout: boolean;
        isReset: boolean;
        isIndex: boolean;
        isFallback: boolean;
        isPage: boolean;
        meta: {
            preload: boolean;
            "precache-order": boolean;
            "precache-proximity": boolean;
            recursive: boolean;
        };
        path: string;
        id: string;
        component: () => typeof Splash;
    }[];
    export const isLayout: boolean;
    export const isReset: boolean;
    export const isIndex: boolean;
    export const isFallback: boolean;
    export const meta: {
        preload: boolean;
        "precache-order": boolean;
        "precache-proximity": boolean;
        recursive: boolean;
    };
    export const path: string;
}
export const tree: any;
export const routes: any[];
import Splash from "*.svelte";
