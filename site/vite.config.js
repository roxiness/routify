import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'
import { readFileSync } from 'fs'

const production = process.env.NODE_ENV === 'production'

export default defineConfig({
    clearScreen: false,
    plugins: [
        svelte({
            emitCss: true,
            compilerOptions: {
                dev: !production,
            },
            extensions: ['.md', '.svelte'],
            preprocess: [mdsvex({ extension: 'md' })],
        }),
        {
            name: 'svg',
            transform: (code, id) =>
                id.endsWith('.svg')
                    ? 'export default ' + JSON.stringify(readFileSync(id, 'utf-8'))
                    : null,
        },
    ],
    server: { port: 1337 },
    build: {
        polyfillDynamicImport: false,
        cssCodeSplit: false,
    },
    optimizeDeps: { include: ['prismjs'] },
    resolve: {
        dedupe: ['svelte'],
        alias: {
            '#root': process.cwd() + '/../',
            '#lib': process.cwd() + '/../lib',
            '#cmp': process.cwd() + '/src/components',
        },
    },
})
