export function exporter({ instance }: {
    instance: Routify;
}): Promise<void[]>;
export function exportNode(rootNode: Node, outputDir: string): void;
import { Routify } from "../../common/Routify.js";
import { Node } from "../../common/Node.js";
