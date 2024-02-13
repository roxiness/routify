export function getSpank(): Promise<any>;
export function stripLogs(id: any, code: any): Promise<any>;
export function postSsrBuildProcess(options?: Partial<VitePluginOptions> | undefined): Promise<void>;
export function normalizeOptions(input: Partial<VitePluginOptionsInput>, isProduction: boolean): VitePluginOptions;
