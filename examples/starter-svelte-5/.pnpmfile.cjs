const path = require('path')

module.exports = {
    hooks: {
        // Intercept and modify dependency resolution
        readPackage(pkg) {
            // Force specific versions of dependencies
            // if (pkg.dependencies?.svelte) {
            //     pkg.dependencies.svelte = '5.16.0'
            // }
            // if (pkg.peerDependencies?.svelte) {
            //     pkg.peerDependencies.svelte = '5.16.0'
            // }

            // Resolve @roxi/routify from a custom local path
            if (pkg.dependencies?.['@roxi/routify']) {
                pkg.dependencies['@roxi/routify'] = `file:${path.resolve(
                    __dirname,
                    '../..',
                )}`
            }

            return pkg
        },
    },
}
