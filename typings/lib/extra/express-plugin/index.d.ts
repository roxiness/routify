export function routifyViteSsr(createViteServer: Function, options?: Options): Promise<any>;
export function routifyProdSsr(pathToSSRScript?: string): Promise<(req: any, res: any, next: any) => Promise<void>>;
export type Options = {
    /**
     * Vite config
     */
    viteServerConfig?: import("vite").InlineConfig;
};
