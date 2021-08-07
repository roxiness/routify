/** @param {TreePayload} node  */
export function stripDefaultsAndDevProps(node: TreePayload): {
    children: any[];
};
export function restoreDefaults(node: any): any;
export namespace defaultNode {
    export const isDir: boolean;
    export const ext: string;
    export const isLayout: boolean;
    export const isReset: boolean;
    export const isIndex: boolean;
    export const isFallback: boolean;
    export const isPage: boolean;
    export const ownMeta: {};
    export namespace meta {
        export const recursive: boolean;
        export const preload: boolean;
        export const prerender: boolean;
    }
    export const id: string;
}
