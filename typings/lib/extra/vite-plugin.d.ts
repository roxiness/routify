/**
 * @typedef {Object} VitePluginOptions
 * @prop {Boolean} run run Routify
 */
/**
 * @param {Partial<RoutifyBuildtimeOptions & VitePluginOptions>=} options
 * @returns
 */
export default function RoutifyPlugin(options?: Partial<RoutifyBuildtimeOptions & VitePluginOptions> | undefined): {
    name: string;
    options: () => Promise<any>;
    config: () => {
        resolve: {
            alias: {
                '#root': string;
                '#lib': string;
            };
        };
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
};
