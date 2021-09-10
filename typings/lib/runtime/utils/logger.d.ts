export { log };
export function getLogLevel(): string | 0;
export function setLogLevel(value: any): void;
export function debugWrapper<T extends Function>(fn: T, msg: string): T;
import log from "consola";
