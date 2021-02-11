/**
 * NOTE Debug util
 *
 * Logs the current value in the pipeline and exit the process.
 */
export function _dump(x: any): never;
/**
 * NOTE Debug util
 *
 * Logs the current value in the pipeline.
 */
export function _log(x: any): any;
export function filter(predicate: any): (array: any) => any;
export function filterAsync(mapper: any, array: any): Promise<any[]>;
export function identity(x: any): any;
export function mapAsync(mapper: any, array: any): Promise<[any, any, any, any, any, any, any, any, any, any]> | ((_array: any) => Promise<[any, any, any, any, any, any, any, any, any, any]>);
export function noop(): void;
export function nope(): boolean;
export function pipe(...fns: any[]): (initial: any) => any;
export function pipeAsync(...mws: any[]): Promise<{}>;
export function someAsync(postulate: any, array: any): Promise<boolean>;
