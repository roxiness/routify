export function assignNode(target: RNodeBuildtime | RNodeRuntime, ...sources: (RNodeBuildtime | RNodeRuntime)[]): import("../buildtime/RNodeBuildtime").RNodeBuildtime | import("../runtime/Instance/RNodeRuntime").RNodeRuntime;
export function findNearestParent(node: RNodeRuntime, callback: (arg0: RNodeRuntime['parent']) => any): RNodeRuntime['parent'] | undefined;
export function getDistance(parentNode: RNodeRuntime, childNode: RNodeRuntime): number | undefined;
