export function getSvelteVersion(): any;
/**
 * Debounce per key
 * @param {string} key
 * @param {number} delay
 * @param {Function} fn
 */
export function debounce(key: string, delay: number, fn: Function): void;
export function relativeUnix(path: any, path2: any): string;
export function createDirname(meta: any): string;
export function stringifyWithEscape(obj: any): string;
export function resolvePlugins(plugins: any[]): Promise<RoutifyBuildtimePlugin[]>;
export function writeFileIfDifferent(path: any, content: any): Promise<void>;
export function writeFileIfDifferentSync(path: any, content: any): void;
export function split(importFrom?: string): (value: any, path: string) => () => Promise<any>;
export function hashObj(val: any): string;
export function deepSet(t: any, p: any, ...v: any[]): any;
