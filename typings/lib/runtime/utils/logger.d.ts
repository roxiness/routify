export function createRootLogger(): any;
export function loadState(): any;
export function saveState(log: any): void;
export function debugWrapper<T extends Function>(fn: T, msg: string): T;
