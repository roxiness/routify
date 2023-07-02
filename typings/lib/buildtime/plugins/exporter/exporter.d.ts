export function exporter({ instance }: {
    instance: RoutifyBuildtime;
}): Promise<void[]>;
export function exportNode(rootNode: RNodeBuildtime): Promise<void>;
export function exportInstance(rootNode: RNodeBuildtime): Promise<void>;
export function exportSitemap(rootNode: any): Promise<void>;
export function exportRender(instance: RoutifyBuildtime): Promise<void>;
export function exportRoutifyInit(instance: RoutifyBuildtime): Promise<void>;
export function exportRouteMap(instance: RoutifyBuildtime): Promise<void>;
