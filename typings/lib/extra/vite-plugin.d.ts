/**
 * @typedef {Object} VitePluginOptions
 * @prop {Boolean} run run Routify
 * @prop {Boolean} forceLogging force logging in production
 */
/**
 * @param {Partial<RoutifyBuildtimeOptions & VitePluginOptions>=} options
 * @returns
 */
export default function RoutifyPlugin(options?: Partial<RoutifyBuildtimeOptions & VitePluginOptions> | undefined): {
    name: string;
    buildStart: () => Promise<any>;
    config: () => {
        build: {
            polyfillDynamicImport: boolean;
            cssCodeSplit: boolean;
        };
    };
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
};
