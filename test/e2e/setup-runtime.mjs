import { rollup } from 'rollup'
import { createDirname } from '../../lib/buildtime/utils.js'
import { RoutifyBuildtime } from '../../lib/buildtime/RoutifyBuildtime.js'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import fse from 'fs-extra'
import { spassr } from 'spassr'
import svelte from 'rollup-plugin-svelte'

// import json from '@rollup/plugin-json';
// import sucrase from '@rollup/plugin-sucrase';
// import typescript from '@rollup/plugin-typescript';
// import pkg from './package.json';

const __dirname = createDirname(import.meta)
const buildDir = `${__dirname}/runtime/public/build`

const inputOptions = {
    input: `${__dirname}/runtime/index.js`,
    plugins: [
        svelte({
            emitCss: false,
            compilerOptions: {
                // enable run-time checks when not in production
                dev: true,
            },
        }),
        nodeResolve({
            browser: true,
            dedupe: ['svelte'],
        }),
        commonjs(),
    ],
}

async function buildRollup() {
    // create a bundle
    const bundle = await rollup(inputOptions)

    // console.log(bundle.watchFiles) // an array of file names this bundle depends on

    // or write the bundle to disk
    await bundle.write({
        sourcemap: true,
        format: 'esm',
        name: 'app',
        dir: `${__dirname}/runtime/public/build`,
    })

    // closes the bundle
    await bundle.close()
}

const routifyInstance = new RoutifyBuildtime({
    routesDir: {
        default: `${__dirname}/runtime/routes`,
        // widget1: `${__dirname}/src/widget1/routes`,
        // widget2: `${__dirname}/src/widget2/routes`,
    },
    routifyDir: `${__dirname}/runtime/.routify`,
    watch: false,
})

const startSpassr = () =>
    spassr({
        assetsDir: `${__dirname}/runtime/public`,
        script: `${__dirname}/runtime/public/build/bundle.js`,
        port: 3334,
        entrypoint: `${__dirname}/runtime/public/index.html`,
    })

export const setupRuntime = async () => {
    console.log('setting up runtime...', __dirname)
    fse.existsSync(buildDir) && fse.rmdirSync(buildDir, { recursive: true })
    await routifyInstance.start()
    await buildRollup()
    const spassrHandle = await startSpassr()
    console.log('setting up runtime... done!')

    const teardown = async () => {
        console.log('tearing down runtime...')
        await spassrHandle.close()
        // routifyInstance.close()
        console.log('tearing down runtime... done!')
    }

    global.__TEARDOWN__ = teardown

    return teardown
}

export default setupRuntime

if (process.argv.includes('run')) setupRuntime()
