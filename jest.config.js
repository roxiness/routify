const common = {
    watchPathIgnorePatterns: [
        '/node_modules/',
        '/.routify/',
        'routes.default.js',
        '/build/',
        '/temp/',
        '/output/',
        '.history',
    ],
    moduleNameMapper: {
        '^#lib(.+)$': '<rootDir>lib$1',
        '^#root(.+)$': '<rootDir>$1',
    },
    testTimeout: 30000,
    modulePaths: ['<rootDir>'],
    roots: ['<rootDir>'],

    transform: {
        '^.+\\.svelte$': [
            'svelte-jester',
            {
                preprocess: false,
            },
        ],
    },
}

export default {
    ...common,
    projects: [
        {
            ...common,
            displayName: 'unit',
            testEnvironment: 'node',
            testMatch: [
                '**/test/unit/**/?(*.)+(spec|test).[jt]s?(x)',
                '**/lib/**/?(*.)+(spec|test).[jt]s?(x)',
            ],
        },
        {
            ...common,
            displayName: 'integration',
            testEnvironment: 'node',
            testMatch: ['**/test/integration/**/?(*.)+(spec|test).[jt]s?(x)'],
        },
        {
            ...common,
            displayName: 'e2e',
            moduleNameMapper: {
                '^#lib(.+)$': '<rootDir>/lib$1',
            },
            testMatch: ['**/test/e2e/**/?(*.)+(spec|test).[jt]s?(x)'],
            preset: 'jest-playwright-preset',
            globalSetup: './test/e2e/setup-runtime.mjs',
            globalTeardown: './test/e2e/teardown-runtime.js',
        },
        {
            ...common,
            displayName: 'examples',
            preset: 'jest-playwright-preset',
            testMatch: ['**/test/examples/**/?(*.)+(spec|test).[jt]s?(x)'],
        },
    ],
}
