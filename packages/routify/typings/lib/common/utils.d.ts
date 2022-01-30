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
export function mockRoutes<T extends import("../buildtime/RoutifyBuildtime").RoutifyBuildtime | import("../runtime/Instance/RoutifyRuntime").RoutifyRuntime>(instance: T, routes: {
    [x: string]: any;
}): import("../buildtime/RNodeBuildtime").RNodeBuildtime | import("../runtime/Instance/RNodeRuntime").RNodeRuntime;
