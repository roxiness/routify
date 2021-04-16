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
export function sortPlugins(_plugins: RoutifyPlugin[]): RoutifyPlugin[];
export function writeDynamicImport(file: string, value: any): () => Promise<any>;
export function createDirname(meta: any): string;
