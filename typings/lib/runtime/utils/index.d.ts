export * from "./logger.js";
export function getRoutifyFragmentContext(suppress: any): any;
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
export function insertWildcards(str: string): string;
export function fromEntries(iterable: any): any;
export function populateUrl(path: string, params: {
    [x: string]: string | string[];
}, overloadStringifier: (obj: {
    [x: string]: string;
}) => string): {
    path: string;
    query: string;
};
export function urlFromAddress(): string;
export function autoIncrementer(storeObj?: {}, name?: string): any;
export function distinctBy<T>(prop: string): (arg0: T, arg1: number, arg2: T[]) => boolean;
export namespace contexts {
    const router: Router;
    const fragment: RenderContext;
}
export function getable<T>(value: T, start?: import("svelte/store").StartStopNotifier<T> | undefined): Getable<T>;
export function identicalRoutes(...routes: Route[]): string;
export function clone<T>(obj: T, ...rest: any[]): T;
export function isAnonFn(input: any): boolean;
export function resolveIfAnonFn<T, P>(subject: T | ((...P: any) => T) | ((...P: any) => Promise<T>), params?: P[] | undefined): T;
export function resolveIfHasCallback(subject: any, params: any, field?: string): any;
export function pushToOrReplace(arr: any[], input: any): any[];
export function waitFor<T>(store: import("svelte/store").Writable<T>, cb: (T: any) => boolean): Promise<T>;
export function createDeferredPromise<T>(): DeferredPromise<T>;
export function forceSingleSlash(str: string): string;
export type Getable<T> = import("svelte/store").Writable<T> & {
    get: () => T;
};
