export const defaultNode = {
    "isDir": false,
    "ext": "svelte",
    "isLayout": false,
    "isReset": false,
    "isIndex": false,
    "isFallback": false,
    "isPage": false,
    "ownMeta": {},
    "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
    },
    "id": "__fallback",
}

const devProps = [
    'file', 'filepath', 'name', 'badExt', 'relativeDir', 'absolutePath',
    'importPath', 'isFile'
]

/** @param {TreePayload} node  */
export function stripDefaultsAndDevProps(node) {
    const strippedNode = {}

    Object.entries(node)
        .filter(([key]) => !devProps.includes(key))
        .filter(([key, value]) => JSON.stringify(defaultNode[key]) !== JSON.stringify(value))
        .forEach(([key, value]) => strippedNode[key] = value)

    if (node.children)
        strippedNode.children = [...node.children.map(stripDefaultsAndDevProps)]

    return strippedNode
}

export function restoreDefaults(node) {
    Object.entries(defaultNode).forEach(([key, value]) => {
        if (typeof node[key] === 'undefined')
            node[key] = value
    })
    
    if(node.children)
        node.children = node.children.map(restoreDefaults)

    return node
}