export function normalizePreset(preset: any, defaultPreset: any): any;
export function normalizeConfig(config: ThemeUserConfig, rootNodes: {
    [x: string]: any;
}): ThemeConfig;
export function coerceArray(value: any): any[];
export function arraysAreEqual(a: any, b: any): any;
/**
 * A flexible input format where each theme combination can be:
 * - An array of strings (e.g., ['de', 'xmas'])
 * - A single string (e.g., 'de')
 */
export type ThemeUserHierarchy = (string[] | string)[];
/**
 * A normalized format where every theme combination is an array of strings.
 * Example: [['de', 'xmas'], ['en', 'xmas'], ['de']]
 */
export type ThemeHierarchy = string[][];
export type ThemeUserPresetObject = {
    /**
     * - The user-defined hierarchy for themes.
     */
    preferences: ThemeUserHierarchy;
    /**
     * - Optional. Namespaces to override global ones.
     */
    namespaces?: string[];
    /**
     * - Optional. Root nodes the preset applies to.
     */
    rootNodes?: string[];
};
export type ThemeUserPreset = ThemeUserHierarchy | ThemeUserPresetObject;
export type ThemePreset = {
    /**
     * - The normalized hierarchy for themes.
     */
    preferences: ThemeHierarchy;
    /**
     * - Optional. Namespaces overriding global ones.
     */
    namespaces: string[];
    /**
     * - Optional. Root nodes this preset applies to.
     */
    rootNodes: string[];
};
export type ThemeUserConfigDefaults = Partial<ThemeConfigDefaults>;
export type ThemeConfigDefaults = {
    /**
     * - Optional. The default theme to assign a file without a theme.
     */
    file: string;
    /**
     * - Optional. The default theme to use in the app.
     */
    app: string;
    /**
     * - Optional. The default namespace for all presets.
     */
    namespace: string;
    /**
     * - Optional. The default root nodes for all presets.
     */
    rootNodes: string[];
};
export type ThemeUserConfig = {
    /**
     * - The user-defined theme presets.
     */
    presets: {
        [x: string]: ThemeUserPreset;
    };
    /**
     * - Optional. Additional themes to merge with presets.
     */
    defaults?: ThemeUserConfigDefaults;
};
export type ThemeConfig = {
    presets: {
        [x: string]: ThemePreset;
    };
    defaults: ThemeConfigDefaults;
};
