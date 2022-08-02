/**
 * @param {Partial<VitePluginOptions>=} options
 * @returns
 */
export default function RoutifyPlugin(options?: Partial<VitePluginOptions> | undefined): {
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
