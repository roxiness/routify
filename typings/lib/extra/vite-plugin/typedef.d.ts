type VitePluginSpecificOptions = {
    /**
     * Run Routify
     */
    run: boolean;
    /**
     * Force logging in production
     */
    forceLogging: boolean;
    /**
     * SSR options
     */
    ssr: Partial<VitePluginOptions_SSR>;
};
type VitePluginOptions_SSR = {
    /**
     * enable ssr in dev
     */
    enable: boolean;
    type: "cjs" | "esm";
    /**
     * Prerender pages into dist/client
     */
    prerender?: boolean | undefined;
    /**
     * Options to use with spank when prerendering
     */
    spank: any;
};
type VitePluginOptions = RoutifyBuildtimeOptions & VitePluginSpecificOptions;
