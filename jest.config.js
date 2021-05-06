const common = {
    watchPathIgnorePatterns: [
        '/node_modules/',
        '/.routify/',
        '/build/',
        '/temp/',
        '/output/',
    ],
    moduleNameMapper: {
        '^#lib(.+)$': '<rootDir>/lib$1',
    },
    testTimeout: 2000,
}

export default {
    projects: [
        {
            ...common,
            displayName: 'unit',
            testMatch: [
                '**/test/unit/**/?(*.)+(spec|test).[jt]s?(x)',
                '**/lib/**/?(*.)+(spec|test).[jt]s?(x)',
            ],
        },
        {
            ...common,
            displayName: 'integration',
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
        },
    ],
}
