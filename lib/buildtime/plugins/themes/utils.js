/**
 * @typedef {(string[]|string)[]} ThemeUserHierarchy
 * A flexible input format where each theme combination can be:
 * - An array of strings (e.g., ['de', 'xmas'])
 * - A single string (e.g., 'de')
 */

/**
 * @typedef {string[][]} ThemeHierarchy
 * A normalized format where every theme combination is an array of strings.
 * Example: [['de', 'xmas'], ['en', 'xmas'], ['de']]
 */

/**
 * @typedef {Object} ThemeUserPresetObject
 * @property {ThemeUserHierarchy} preferences - The user-defined hierarchy for themes.
 * @property {string[]} [namespaces] - Optional. Namespaces to override global ones.
 * @property {string[]} [rootNodes] - Optional. Root nodes the preset applies to.
 */

/**
 * @typedef {ThemeUserHierarchy|ThemeUserPresetObject} ThemeUserPreset
 */

/**
 * @typedef {Object} ThemePreset
 * @property {ThemeHierarchy} preferences - The normalized hierarchy for themes.
 * @property {string[]} namespaces - Optional. Namespaces overriding global ones.
 * @property {string[]} rootNodes - Optional. Root nodes this preset applies to.
 */

/**
 * @typedef {Partial<ThemeConfigDefaults>} ThemeUserConfigDefaults
 */

/**
 * @typedef {Object} ThemeConfigDefaults
 * @property {string} file - Optional. The default theme to assign a file without a theme.
 * @property {string} app - Optional. The default theme to use in the app.
 * @property {string} namespace - Optional. The default namespace for all presets.
 * @property {string[]} rootNodes - Optional. The default root nodes for all presets.
 */

/**
 * @typedef {Object} ThemeUserConfig
 * @property {Object<string, ThemeUserPreset>} presets - The user-defined theme presets.
 * @property {ThemeUserConfigDefaults} [defaults] - Optional. Additional themes to merge with presets.
 */

/**
 * @typedef {Object} ThemeConfig
 * @property {Object<string, ThemePreset>} presets
 * @property {ThemeConfigDefaults} defaults
 */

const configDefaults = {
    defaults: {
        file: 'en',
        app: 'en',
        namespaces: [/^@_/],
        rootNodes: [],
    },
    presets: {},
}

export const normalizePreset = (preset, defaultPreset) => {
    const _preset = { ...defaultPreset }
    if (Array.isArray(preset)) _preset.preferences = [...preset]
    else Object.assign(_preset, preset)
    _preset.preferences = _preset.preferences.map(coerceArray)
    return _preset
}

/**
 *
 * @param {ThemeUserConfig} config
 * @param {Object<string, any>} rootNodes
 * @returns
 */
export const normalizeConfig = (config, rootNodes) => {
    const _config = { ...configDefaults, ...config }
    _config.defaults = { ...configDefaults.defaults, ...config.defaults }

    const defaultPreset = {
        preferences: [],
        namespaces: _config.defaults.namespaces,
        rootNodes,
    }

    Object.keys(_config.presets).forEach(
        key =>
            (_config.presets[key] = normalizePreset(_config.presets[key], defaultPreset)),
    )
    return _config
}

export const coerceArray = value => (Array.isArray(value) ? value : [value])

export const arraysAreEqual = (a, b) =>
    a.length === b.length && a.every((v, i) => v === b[i])
