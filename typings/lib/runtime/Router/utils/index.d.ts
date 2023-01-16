export function normalizeRouterOptions(options: Partial<RoutifyRuntimeOptions>, config?: Partial<RouterOptionsNormalized> | undefined): Partial<RouterOptionsNormalized>;
export type RouterOptionsNormalizedOverlay = {
    /**
     * hook: transforms paths to and from router and browser
     */
    urlRewrite: UrlRewrite[];
    /**
     * hook: runs before each router initiation
     */
    beforeRouterInit: RouterInitCallback[];
    /**
     * hook: runs after each router initiation
     */
    afterRouterInit: RouterInitCallback[];
    /**
     * hook: guard that runs before url changes
     */
    beforeUrlChange: BeforeUrlChangeCallback[];
    /**
     * hook: runs after url has changed
     */
    afterUrlChange: AfterUrlChangeCallback[];
    /**
     * hook: transform route fragments after navigation
     */
    transformFragments: TransformFragmentsCallback[];
    /**
     * hook: runs before router is destroyed
     */
    onDestroy: OnDestroyRouterCallback[];
};
export type RouterOptionsNormalized = RoutifyRuntimeOptions & RouterOptionsNormalizedOverlay;
