import { svelte } from '@sveltejs/vite-plugin-svelte'

console.log(
    svelte({
        compilerOptions: {
            hydratable: true,
        },
    }),
)

console.log(
    svelte({
        compilerOptions: {
            hydratable: false,
        },
    }),
)
