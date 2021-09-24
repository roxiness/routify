/**
 * @template {{}} T
 * @template {{}} T2
 * @param {T} target
 * @param  {...T2} sources
 * @return {T&Partial<T2>} //jsdoc unaware of mutation - incorrectly wants partial T2
 */
export function deepAssign<T extends {}, T2 extends {}>(target: T, ...sources: T2[]): T & Partial<T2>;
/**
 * @param {RoutifyPlugin[]} _plugins
 * @returns {RoutifyPlugin[]}
 */
export function sortPlugins(plugins: any): any[];
export function isObjectOrArray(v: any): boolean;
export function normalizePlugins(plugins: any): any[];
export function mockRoutes<T extends any>(instance: T, routes: {
    [x: string]: any;
}): T;
