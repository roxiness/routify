import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'

const production = !process.env.ROLLUP_WATCH

export default {
    input: 'src/main.js',
    output: {
        sourcemap: true,
        format: 'esm',
        name: 'app',
        dir: 'public/build',
        chunkFileNames: `[name]${(production && '-[hash]') || ''}.js`,
    },
    plugins: [
        svelte({
            emitCss: false,
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production,
            },
        }),
        resolve({
            browser: true,
            dedupe: ['svelte'],
        }),
        commonjs(),
        livereload('public'),
    ],
    watch: {
        clearScreen: false,
    },
}
