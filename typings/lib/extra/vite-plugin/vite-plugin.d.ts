/**
 * @typedef {Object} VitePluginOptions
 * @prop {Boolean} run Run Routify
 * @prop {Boolean} forceLogging Force logging in production
 * @prop {Partial<VitePluginOptions_SSR>} ssr SSR options
 */
/**
 * @typedef {Object} VitePluginOptions_SSR
 * @prop {boolean} enable enable ssr in dev
 * @prop {"cjs"|"esm"} type
 * @prop {boolean=} [prerender=true] Prerender pages into dist/client
 * @prop {any} spank Options to use with spank when prerendering
 */
/**
 * @param {Partial<RoutifyBuildtimeOptions & VitePluginOptions>=} options
 * @returns
 */
export default function RoutifyPlugin(options?: Partial<RoutifyBuildtimeOptions & VitePluginOptions> | undefined): {
    name: string;
    buildStart: () => Promise<any>;
    config: (cfg: any) => {
        server: {
            fs: {
                strict: boolean;
                allow: string[];
            };
        };
        build: {
            ssr: any;
            outDir: string;
            polyfillDynamicImport: boolean;
        };
    };
    configureServer: (server: any) => () => any;
    closeBundle: () => Promise<void>;
    transform: (str: any, id: any) => Promise<any>;
};
export type VitePluginOptions = {
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
export type VitePluginOptions_SSR = {
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
