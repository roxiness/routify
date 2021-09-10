export function BrowserAdapter(input?: BrowserAdapterOptions): {
    /**
     * @param {string} url
     * @param {Router} router
     * @returns {string}
     */
    toRouter: (url: string, router: Router) => string;
    /**
     * @param {Router[]} routers
     * @returns {string}
     */
    toBrowser: (routers: Router[]) => string;
};
export type BrowserAdapterOptions = {
    /**
     * separates the url of each router
     */
    delimiter: string;
    /**
     * defaults to `${router.name}=${router.url}`
     */
    format: (router: Router) => string;
};
