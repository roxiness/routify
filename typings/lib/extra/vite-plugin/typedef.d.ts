type VitePluginSpecificOptionsRenderInput = {
    /**
     * Server Side Rendering - prerender pages on the server
     */
    ssr: Partial<VitePluginOptions_SSR> | boolean;
    /**
     * Static Site Generation - prerender pages at build time
     */
    ssg: Partial<VitePluginOptions_SSG> | boolean;
    /**
     * Client Side Rendering - render pages in the client browser, also known as SPA
     */
    csr: Partial<VitePluginOptions_CSR> | boolean;
};
type VitePluginSpecificOptionsRender = {
    /**
     * Server Side Rendering - prerender pages on the server
     */
    ssr: VitePluginOptions_SSR;
    /**
     * Static Site Generation - prerender pages at build time
     */
    ssg: VitePluginOptions_SSG;
    /**
     * Client Side Rendering - render pages in the client browser, also known as SPA
     */
    csr: VitePluginOptions_CSR;
};
type VitePluginSpecificOptions = {
    /**
     * Run Routify
     */
    run: boolean;
    /**
     * Force logging in production
     */
    forceLogging: boolean;
    render: VitePluginSpecificOptionsRender;
    outDir: string;
};
type VitePluginSpecificOptionsInput = {
    /**
     * Run Routify
     */
    run: boolean;
    /**
     * Force logging in production
     */
    forceLogging: boolean;
    render: Partial<VitePluginSpecificOptionsRenderInput>;
};
type VitePluginOptions_SSG = {
    enable: boolean;
    /**
     * Options to use with spank when prerendering
     */
    spank: any;
};
type VitePluginOptions_SSR = {
    /**
     * enable ssr in dev
     */
    enable: boolean;
    type: "cjs" | "esm";
};
type VitePluginOptions_CSR = {
    enable: boolean;
};
type VitePluginOptions = RoutifyBuildtimeOptions & VitePluginSpecificOptions;
type VitePluginOptionsInput = RoutifyBuildtimeOptions & VitePluginSpecificOptionsInput;
