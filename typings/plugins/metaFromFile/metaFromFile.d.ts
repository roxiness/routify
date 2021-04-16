export function parseComment(body: string): {
    [x: string]: any;
};
export function htmlComments(filepath: string): Promise<{}>;
export function externalComments(filepath: string, output: string): Promise<any>;
/**
 * @param {{instance: Routify}} param0
 */
export function metaFromFile({ instance }: {
    instance: Routify;
}): Promise<void>;
import { Routify } from "../../common/Routify.js";
