/**
 * @typedef {Object} VitePluginOptions
 * @prop {Boolean} run run Routify
 * @prop {Boolean} forceLogging force logging in production
 * @prop {any} ssr
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
    closeBundle: () => Promise<void>;
    transform: (code: any, id: any) => any;
};
export type VitePluginOptions = {
    /**
     * run Routify
     */
    run: boolean;
    /**
     * force logging in production
     */
    forceLogging: boolean;
    ssr: any;
};
