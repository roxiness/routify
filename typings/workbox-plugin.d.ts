export function freshCacheData(event: any): any;
export function RoutifyPlugin(defaultOptions: any): {
    cachedResponseWillBeUsed({ cacheName, request, matchOptions, cachedResponse, event }: {
        cacheName: any;
        request: any;
        matchOptions: any;
        cachedResponse: any;
        event: any;
    }): any;
    cacheDidUpdate: ({ cacheName, request, oldResponse, newResponse, event }: {
        cacheName: any;
        request: any;
        oldResponse: any;
        newResponse: any;
        event: any;
    }) => Promise<void>;
};
