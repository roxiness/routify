export function themes({ instance }: {
    instance: any;
}): Promise<void>;
export function createThemedRootNodes(instance: RoutifyBuildtime, config: import("./utils.js").ThemeConfig): void;
export function createThemedRootNode(instance: RoutifyBuildtime, name: any, themePreferenceGroups: (string[] | string)[], rootNodeName: any): void;
export function nodeMatchesThemes(node: any, themes: any): any;
export function copyNodeToTheme(rootNode: any): (node: any) => void;
export function copyNode(node: RNode, rootNode: any, location?: string): void;
export function tagNodeThemes(node: RNode): void;
