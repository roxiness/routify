export * from "./logger.js";
export function isDescendantElem(parent: any): (elem: any) => boolean;
export function getUrlFromClick(event: any): string;
export function pathAndParamsToUrl(path: string, params: any, queryHandler: Function): string;
export function fromEntries(iterable: any): any;
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
export type Getable<T> = import('svelte/store').Writable<T> & {
    get: () => T;
};
import { get } from "../../../../node_modules/svelte/types/runtime/store/index.js";
