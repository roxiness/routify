export function preloadUrl(url?: (string | string[]) | undefined): Promise<void[]>;
export function preloadUrlFromUrlPairs(urlPairs: UrlPair[]): Promise<void>;
export function getPrimaryUrl(urlPairs: UrlPair[]): string;
export type UrlPair = [routerName: string, url: string];
