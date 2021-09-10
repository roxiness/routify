export function exporter({ instance }: {
    instance: any;
}): Promise<[any, any, any, any, any, any, any, any, any, any]>;
export function exportNode(rootNode: import("../../../common/RNode.js").RNode<any>, outputDir: string): void;
export function exportInstance(rootNode: import("../../../common/RNode.js").RNode<any>, outputDir: string): void;
