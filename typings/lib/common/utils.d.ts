/**
 * @template {{}} T
 * @template {{}} T2
 * @param {T} receiver
 * @param  {...T2} sources
 * @return {T&Partial<T2>} //partial because we're not guaranteed that types are preserved
 */
export function deepAssign<T extends {}, T2 extends {}>(receiver: T, ...sources: T2[]): T & Partial<T2>;
/**
 * @param {RoutifyBuildtimePlugin[]} plugins
 * @returns {RoutifyBuildtimePlugin[]}
 */
export function sortPlugins(plugins: RoutifyBuildtimePlugin[]): RoutifyBuildtimePlugin[];
export function isObjectOrArray(v: any): boolean;
export function normalizePlugins(plugins: RoutifyBuildtimePlugin[]): RoutifyBuildtimePlugin[];
export function mockRoutes<T extends RoutifyBuildtime | RoutifyRuntime>(instance: T, routes: {
    [x: string]: any;
}): import("../buildtime/RNodeBuildtime").RNodeBuildtime | import("../runtime/Instance/RNodeRuntime").RNodeRuntime;
export function addPropsToComp<Component extends typeof import("svelte/internal").SvelteComponentDev>(Comp: Component, props: {
    [x: string]: any;
}): Component;
export function next<T extends import("svelte/store").Readable<V>, V>(store: T, wanted?: (((wanted: V) => boolean) | V) | undefined, strict?: boolean | undefined): Promise<V>;
export function throttle(fn: any, hash: any): Promise<void>;
export function lazySet(store: any, value: any): any;
export function jsonClone(obj: any): any;
export function getCachedData<V>(callback: () => V, collection: any, id: any, store?: any): V;
export function initializeCache(idGenerator: () => any, defaultContext: any): {
    <T>(dataProducer: () => T, context: any): T;
    storage: Map<any, any>;
};
export function writableWithGetter(initialValue: any): {
    subscribe: (this: void, run: import("svelte/store").Subscriber<any>, invalidate?: import("svelte/store").Invalidator<any>) => import("svelte/store").Unsubscriber;
    set: (this: void, value: any) => void;
    update: (this: void, updater: import("svelte/store").Updater<any>) => void;
    get: () => any;
};
