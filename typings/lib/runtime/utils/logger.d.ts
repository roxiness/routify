export function createRootLogger(): import("consolite").ConsoliteLogger<import("consolite").ExtendConsole, Console & {
    [x: string]: Function;
}>;
export function loadState(): any;
export function saveState(log: any): void;
export function debugWrapper<T extends Function>(fn: T, msg: string): T;
