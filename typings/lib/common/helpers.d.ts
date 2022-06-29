export function assignNode(target: RNodeRuntime, ...sources: RNodeRuntime[]): RNodeRuntime;
export function findNearestParent(node: RNodeRuntime, callback: (arg0: RNodeRuntime['parent']) => any): RNodeRuntime['parent'] | undefined;
export function getDistance(parentNode: RNodeRuntime, childNode: RNodeRuntime): number | undefined;
