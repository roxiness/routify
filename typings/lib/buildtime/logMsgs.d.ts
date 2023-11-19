export function y(str: any): string;
export function r(str: any): string;
export function p(str: any): string;
export function lp(str: any): string;
export function lb(str: any): string;
export function b(str: any): string;
export function g(str: any): string;
export function c(str: any): string;
export function bold(str: any): string;
export const log: import("consolite").ConsoliteLogger<import("consolite").ExtendConsole, Console & {
    [x: string]: Function;
}>;
export namespace logs {
    function buildTime(trigger: any, time: any): void;
    function buildTimePluginsList(plugins: any): void;
    function metaKeysWarning(potentialConflicts: any): void;
}
