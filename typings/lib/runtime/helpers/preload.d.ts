export function preloadUrl(urlOrOptions?: (string | string[] | PreloadOptions) | undefined): Promise<any[][]>;
export function preloadUrlFromUrlPairs(urlPairs: UrlPair[], routesMap?: RoutesMap | undefined): Promise<any[]>;
export function getPrimaryUrl(urlPairs: UrlPair[]): string;
export type UrlPair = [routerName: string, url: string];
export type RoutesMap = {
    [x: string]: () => Promise<any>;
};
export type PreloadOptions = {
    routesMap?: RoutesMap | undefined;
    url?: (string | string[]) | undefined;
};
