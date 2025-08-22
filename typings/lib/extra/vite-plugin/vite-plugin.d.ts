/**
 * @param {Partial<VitePluginOptionsInput>=} input
 */
export default function RoutifyPlugin(input?: Partial<VitePluginOptionsInput> | undefined): {
    name: string;
    buildStart: () => Promise<void>;
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
            outDir: string;
        };
        envPrefix: string[];
        define: {
            'import.meta.env.ROUTIFY_SSR_ENABLE': string;
        };
    };
    transformIndexHtml: (html: any) => any;
    configureServer: (server: any) => () => any;
    configurePreviewServer: (server: any) => () => void;
    closeBundle: () => Promise<void>;
    transform: (str: any, id: any) => Promise<{
        code: any;
        map: any;
    }>;
};
