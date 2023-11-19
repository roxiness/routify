import { hashObj, split } from '../../utils.js'
import { readFile } from 'fs/promises'

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
export const metaCapturePlugin = {
    name: 'metaSplit',
    after: 'metaFromFile',
    before: 'exporter',
    reservedMetaKeys: ['capture', 'captureStart', 'captureEnd'],
    build: async ctx => {
        const promises = ctx.instance.nodeIndex.map(processNode)
        return Promise.all(promises)
    },
}

export const processNode = async node => {
    if (node.meta.capture || node.meta.captureStart) {
        const file = await readFile(node.file.path, 'utf-8')
        node.meta.captures = {}
        if (node.meta.capture) node.meta.captures.file = file
        if (node.meta.captureStart)
            Object.assign(node.meta.captures, captureSegments(file))
    }
}

/**
 * Returns an object with the captured segments
 * A segment is a string between two comments, e.g. <!-- routify:meta captureStart="mySegmentName" --> ... <!-- routify:meta captureEnd="mySegmentName" -->
 * @param {string} content
 */
export const captureSegments = content => {
    const segments = {}
    // find each segment
    const regex =
        /<!--\s*routify:meta\s+captureStart="([^"]+)"\s*-->([\s\S]*?)<!--\s*routify:meta\s+captureEnd="\1"\s*-->/g
    let match
    while ((match = regex.exec(content))) {
        const [_, name, segment] = match
        segments[name] = segment
    }
    return segments
}
