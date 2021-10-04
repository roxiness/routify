export function exporter({ instance }: {
    instance: any;
}): Promise<[any, any, any, any, any, any, any, any, any, any]>;
export function exportNode(rootNode: RNode, outputDir: string): void;
export function exportInstance(rootNode: RNode, outputDir: string): void;
