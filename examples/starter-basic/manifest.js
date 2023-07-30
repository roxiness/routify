import { writeFile, rm } from 'fs/promises'

export default {
    name: 'starter-basic',
    description: 'A basic Routify starter template',
    test: {
        tests: [{ page: '/', contains: 'Welcome to Your New Routify 3 Project!' }],
    },
    features: [
        {
            label: 'examples',
            value: 'examples',
            hint: 'Add examples',
            initial: true,
        },
        {
            label: 'components',
            value: 'components',
            hint: 'Add pre-made components to src/components',
            initial: true,
        },
    ],
    postInstall: async options => {
        if (!options.features.includes('examples')) {
            // write <h1>Hello world</h1> to index.svelte
            const indexSvelte = `${options.projectDir}/src/routes/index.svelte`
            await writeFile(
                indexSvelte,
                `<h1>Welcome to Your New Routify 3 Project!</h1>`,
            )
            // remove examples folder
            await rm(`${options.projectDir}/src/routes/examples`, { recursive: true })
        }
        if (!options.features.includes('components')) {
            // remove components folder
            await rm(`${options.projectDir}/src/components`, { recursive: true })
        }
    },
}
