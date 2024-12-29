export function dynamicImport(specifier: any): Promise<any>;
export function renderModule(module: (SvelteComponentDev | {
    default: SvelteComponentDev;
}) & {
    load: (url: string) => Promise<any>;
}, urlOrOptions?: (string | string[] | import("../../runtime").PreloadOptions) | undefined): Promise<{
    html: string;
    status: number;
    css: {
        code: string;
        map: string;
    };
    head: "";
    error: string;
    maxage: number;
    props: {
        [x: string]: string;
    };
    redirect: string;
}>;
