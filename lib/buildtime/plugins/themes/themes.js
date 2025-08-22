import { coerceArray, arraysAreEqual, normalizeConfig } from './utils.js'

export const themes = async ({ instance }) => {
    const config = normalizeConfig(
        instance.options.themes,
        Object.keys(instance.rootNodes),
    )
    createThemedRootNodes(instance, config)
}

/**
 * @param {RoutifyBuildtime} instance
 * @param {import('./utils.js').ThemeConfig} config
 */
export const createThemedRootNodes = (instance, config) => {
    // remove theme folders
    instance.nodeIndex = instance.nodeIndex.filter(node => !node.name.startsWith('@'))
    // tag nodes
    instance.nodeIndex.forEach(tagNodeThemes)

    Object.entries(config.presets).forEach(([name, themePreset]) => {
        themePreset.rootNodes.forEach(rootNodeName => {
            createThemedRootNode(instance, name, themePreset.preferences, rootNodeName)
        })
    })

    // clean up meta props
    instance.nodeIndex.forEach(node => {
        delete node.meta.__themesPlugin_themes
        delete node.meta.__themesPlugin_parentPath
    })
}

/**
 *
 * @param {RoutifyBuildtime} instance
 * @param {(string[]|string)[]} themePreferenceGroups
 */
export const createThemedRootNode = (
    instance,
    name,
    themePreferenceGroups,
    rootNodeName,
) => {
    const rootNode = instance.rootNodes[rootNodeName].deepClone()
    rootNode.name = name
    rootNode.id = '_' + name
    rootNode['rootName'] = rootNodeName + '-theme-' + name
    instance.rootNodes[rootNodeName + '-theme-' + name] = rootNode
    ;[...themePreferenceGroups].reverse().forEach(themePreferenceGroup => {
        themePreferenceGroup = coerceArray(themePreferenceGroup)
        instance.nodeIndex
            .filter(node => nodeMatchesThemes(node, themePreferenceGroup))
            .forEach(copyNodeToTheme(rootNode))
    })
    // return rootNodes
}

export const nodeMatchesThemes = (node, themes) =>
    node.meta.__themesPlugin_themes &&
    arraysAreEqual(node.meta.__themesPlugin_themes, themes)

export const copyNodeToTheme = rootNode => node =>
    copyNode(node, rootNode, node.meta.__themesPlugin_parentPath || '/')

/**
 * @param {RNode} node
 * @param {string} location
 */
export const copyNode = (node, rootNode, location = '/') => {
    const newNode = node.clone()
    const parent = rootNode.traverse(location)
    // remove existing node
    parent.children.find(child => child.name === newNode.name)?.remove()

    parent.appendChild(newNode)
}

/**
 * @param {RNode} node
 */
export const tagNodeThemes = node => {
    const allTags = [...node.ancestors].reverse().map(a => a.name)

    const themes = allTags
        .filter(tag => tag.startsWith('@') && !tag.startsWith('@_'))
        .map(tag => tag.slice(1))
    const path = allTags.filter(tag => !tag.startsWith('@')).join('/')
    node.meta.__themesPlugin_themes = themes
    node.meta.__themesPlugin_parentPath = path
    // node.meta.__themesPlugin_selfPath = (path + '/' + node.name).replace(/\/+/, '/')
}
