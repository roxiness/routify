/**
 * @type {RoutifyBuildtimePlugin}
 * Can read segments from a file and add them to the node meta
 * @example segment
 * <!-- routify:meta captureStart="mySegmentName" -->
 * ... some content ...
 * <!-- routify:meta captureEnd="mySegmentName" -->
 * @example file
 * <!-- routify:meta capture --> *
 **/
export const metaCapturePlugin: RoutifyBuildtimePlugin;
export function processNode(node: any): Promise<void>;
export function captureSegments(content: string): {};
