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
export function createHook<P>({ pipeline }?: {
    pipeline?: boolean;
}): HooksCollection<P>;
export function populateUrl(path: string, params: {
    [x: string]: string;
}, queryHandler: QueryHandler): string;
export function urlFromAddress(): string;
export function autoIncrementer(storeObj?: {}, name?: string): any;
export function distinctBy<T>(prop: string): (arg0: T, arg1: number, arg2: T[]) => boolean;
export namespace contexts { }
export function getContextMaybe(name: string): any;
export function getable<T>(value: T, start?: import("svelte/store").StartStopNotifier<T>): Getable<T>;
export function identicalRoutes(...routes: Route[]): string;
export type Hook<P> = (pri: P, ...rest: any[]) => (P | void);
export type AddHookToCollection<P> = (hook: Hook<P>) => Function;
export type HooksCollection<P> = AddHookToCollection<P> & {
    runHooks: Hook<P>;
    hooks: Hook<P>[];
};
export type Getable<T> = import('svelte/store').Writable<T> & {
    get: () => T;
};
import { get } from "../../../../node_modules/svelte/types/runtime/store/index.js";
