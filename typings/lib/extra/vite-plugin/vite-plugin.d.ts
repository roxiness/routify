/**
 * @param {Partial<VitePluginOptions>=} options
 */
export default function RoutifyPlugin(options?: Partial<VitePluginOptions> | undefined): {
    name: string;
    buildStart: () => Promise<any>;
    config: (cfg: any) => {
        appType: any;
        server: {
            fs: {
                strict: boolean;
                allow: string[];
            };
        };
        build: {
            ssr: any;
            outDir: any;
        };
        envPrefix: string[];
    };
    configureServer: (server: any) => () => any;
    configurePreviewServer: (server: any) => () => void;
    closeBundle: () => Promise<void>;
    transform: (str: any, id: any) => Promise<any>;
};
