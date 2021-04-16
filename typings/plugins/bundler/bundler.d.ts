export function createBundles(node: Node, outputDir: any): Promise<void>;
export function bundler({ instance }: {
    instance: Routify;
}): Promise<void[]>;
import { Node } from "../../common/Node.js";
import { Routify } from "../../common/Routify.js";
