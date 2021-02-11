/** @param {TreePayload} node  */
export function stripDefaultsAndDevProps(node: TreePayload): {
    children: any[];
};
export function restoreDefaults(node: any): any;
export namespace defaultNode {
    const isDir: boolean;
    const ext: string;
    const isLayout: boolean;
    const isReset: boolean;
    const isIndex: boolean;
    const isFallback: boolean;
    const isPage: boolean;
    const ownMeta: {};
    namespace meta {
        const recursive: boolean;
        const preload: boolean;
        const prerender: boolean;
    }
    const id: string;
}
