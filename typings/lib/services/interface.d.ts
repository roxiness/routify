export function Builder(options: any, returnResult?: boolean, metaParser?: {
    get: (file: any) => Promise<{}>;
    fileChange: (file: any) => Promise<"new" | "uncached" | "changed" | "unchanged">;
    deleteFile: (file: any) => boolean;
}): () => Promise<any>;
export function start(inputOptions: any): {
    waitChange: () => Promise<any>;
    waitIdle: () => Promise<[any, any]>;
    close: () => any;
} | {
    waitChange: () => Promise<void>;
    waitIdle: () => Promise<any>;
    close(): void;
};
