export * from "./logger.js";
export function writable2(value: any): {
    set: (this: void, value: any) => void;
    subscribe: (run: any, invalidator: any) => () => void;
    update: (this: void, updater: import("svelte/store").Updater<any>) => void;
    subscribers: any[];
    hooks: {
        onSub: () => void;
        onUnsub: () => void;
        onFirstSub: () => void;
        onLastUnsub: () => void;
    };
};
export function isDescendantElem(parent: any): (elem: any) => boolean;
export function getUrlFromClick(event: any): string;
export function pathAndParamsToUrl(path: string, params: any, queryHandler: Function): string;
export function fromEntries(iterable: any): any;
export function createHook(): {
    (hook: Function): Function;
    hooks: any[];
};
export function populateUrl(path: string, params: {
    [x: string]: string;
}, queryHandler: QueryHandler): string;
export function urlFromAddress(): string;
export function autoIncrementer(storeObj?: {}, name?: string): any;
export function distinctBy<T>(prop: string): (arg0: T, arg1: number, arg2: T[]) => boolean;
export namespace contexts { }
export function getContextMaybe(name: string): any;
export type getable<T> = import('svelte/store').Writable<T> & {
    get: () => T;
};
export function getable<T_1>(value: T_1, start?: import("svelte/store").StartStopNotifier<T_1>): getable<T_1>;
import { get } from "../node_modules/svelte/types/runtime/store/index.js";
