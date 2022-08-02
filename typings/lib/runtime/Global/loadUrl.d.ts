export function render(compositeUrl: any, module: any): Promise<any>;
export function preloadAllRoutersFromUrlPairs(urlPairs: UrlPair): Promise<void>;
export function preloadAllRouters(url: any): Promise<void>;
export type UrlPair = ['name', 'url'];
