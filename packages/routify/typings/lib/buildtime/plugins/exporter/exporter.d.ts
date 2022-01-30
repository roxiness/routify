export function exporter({ instance }: {
    instance: RoutifyBuildtime;
}): Promise<void[]>;
export function exportNode(rootNode: import("../../../common/RNode.js").RNode<any>, outputDir: string): Promise<void>;
export function exportInstance(rootNode: import("../../../common/RNode.js").RNode<any>, outputDir: string): Promise<void>;
