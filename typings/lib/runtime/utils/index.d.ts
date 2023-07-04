export * from "./logger.js";
export function getRoutifyFragmentContext(): any;
export function getRoutifyFragmentContextMaybe(): any;
export function setRoutifyFragmentContext(value: any): any;
export function isDescendantElem(parent: any): (elem: any) => boolean;
export function shouldIgnoreClick(event: any): any;
export function getUrlFromEvent(event: any): {
    url?: undefined;
    state?: undefined;
} | {
    url: string;
    state: {};
};
export function pathAndParamsToUrl(path: string, params: any, queryHandler: Function, useWildcards: boolean): string;
export function insertWildcards(str: string): string;
export function fromEntries(iterable: any): any;
export function populateUrl(path: string, params: {
    [x: string]: (string | string[]);
}, route: Route): string;
export function urlFromAddress(): string;
export function autoIncrementer(storeObj?: {}, name?: string): any;
export function distinctBy<T>(prop: string): (arg0: T, arg1: number, arg2: T[]) => boolean;
export namespace contexts { }
export function getable<T>(value: T, start?: import("svelte/store").StartStopNotifier<T>): Getable<T>;
export function identicalRoutes(...routes: Route[]): string;
export function clone<T>(obj: T, ...rest: any[]): T;
export function isAnonFn(input: any): boolean;
export function resolveIfAnonFn<T, P>(subject: T | ((...P: any[]) => T) | ((...P: any[]) => Promise<T>), params?: P[]): T;
export function resolveIfHasCallback(subject: any, params: any, field?: string): any;
export function pushToOrReplace(arr: any[], input: any): any[];
export function waitFor<T>(store: import("svelte/store").Writable<T>, cb: (T: any) => boolean): Promise<T>;
export function createDeferredPromise<T>(): DeferredPromise<T>;
export type Getable<T> = import('svelte/store').Writable<T> & {
    get: () => T;
};
import { get } from "svelte/types/runtime/store/index.js";
