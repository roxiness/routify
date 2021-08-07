export function handleScroll(element: any, scrollToTop: any): boolean;
export function handleHash(): boolean;
export function scrollAncestorsToTop(element: any): void;
/** Supresses Routify caused logs and warnings for one tick */
export function suppressComponentWarnings(ctx: any, tick: any): void;
export function currentLocation(): {
    options: any;
    url: URL;
    fullpath: string;
};
/**
 *
 * @param {string} url
 */
export function parseUrl(url: string): {
    url: URL;
    fullpath: string;
};
/**
 * populates parameters, applies urlTransform, prefixes hash
 * eg. /foo/:bar to /foo/something or #/foo/something
 * and applies config.urlTransform
 * @param {*} path
 * @param {*} params
 */
export function resolveUrl(path: any, params: any, inheritedParams: any): string;
/**
 * populates an url path with parameters
 * populateUrl('/home/:foo', {foo: 'something', bar:'baz'})  to /foo/something?bar=baz
 * @param {*} path
 * @param {*} params
 */
export function populateUrl(path: any, params: any, inheritedParams: any): string;
export function pathToRegex(str: any, recursive: any): any;
export function pathToParamKeys(string: any): string[];
export function pathToRank({ path }: {
    path: any;
}): any;
