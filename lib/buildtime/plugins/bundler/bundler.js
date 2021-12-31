import { relativeUnix } from '../../../buildtime/utils.js'
import fse from 'fs-extra'
import { resolve } from 'path'

class Bundles {
    constructor(outputDir) {
        this.outputDir = outputDir
    }

    /** @type {Object.<string, Bundle>} */
    bundles = {}

    /** @param {RNodeBuildtime} node */
    upsert(node) {
        const { path } = node.file
        this.bundles[path] = this.bundles[path] || new Bundle(node, this.outputDir)
        return this.bundles[path]
    }
    async apply() {
        return Promise.all(Object.values(this.bundles).map(bundle => bundle.apply()))
    }
}

class Bundle {
    /** @type {RNode[]} */
    members = []

    /**
     * @param {RNode} node
     * @param {string} outputDir
     * */
    constructor(node, outputDir) {
        this.outputDir = outputDir
        this.instructor = node
        this.filename = 'bundles/' + node.id + '-bundle.js'
    }

    include(node) {
        this.members.push(node)
    }

    async apply() {
        fse.ensureDirSync(this.outputDir)
        const output = resolve(this.outputDir, this.filename)

        const exportStr = this.members
            .map(
                node =>
                    `export * as ${node.id} from '${relativeUnix(
                        this.outputDir + '/bundles',
                        node.module,
                    )}'`,
            )
            .join('\n')

        this.members.forEach(node => {
            // if root prebundle, else codesplit bundle
            if (this.instructor.isRoot)
                node.module = `() => bundle_${this.instructor.id}.${node.id}::_EVAL`
            else
                node.module = `() => import("./${this.filename}").then(r => r.${node.id})::_EVAL`
        })

        await this.instructor.instance.writeFile(output, [exportStr].join('\n'))
    }
}

const bundleIsNotNullOrUndefined = val => ![null, undefined].includes(val.meta.bundle)

/**
 *
 * @param {RNodeBuildtime} node
 * @param {any} outputDir
 */
export const createBundles = async (node, outputDir) => {
    const { routifyDir } = node.instance.options
    const bundles = new Bundles(outputDir)
    const nodes = [node, ...node.descendants].filter(node => node.module)
    // iterate node and its descendants
    for (node of nodes) {
        // look for nearest instructions in node and its ancestors
        const bundleInstructionsNode = [node, ...node.ancestors].find(
            bundleIsNotNullOrUndefined,
        )

        if (bundleInstructionsNode?.meta.bundle) {
            const bundle = bundles.upsert(bundleInstructionsNode)
            bundle.include(node) // bundle file
        } else
            node.module = `() => import('${relativeUnix(
                routifyDir,
                node.module,
            )}')::_EVAL` //codesplit file
    }

    await bundles.apply()
}

/**
 * @param {RoutifyBuildtimePayload} param0
 */
export const bundler = async ({ instance }) => {
    const promises = Object.values(instance.rootNodes).map(rootNode =>
        createBundles(rootNode, instance.options.routifyDir),
    )
    return await Promise.all(promises)
}
