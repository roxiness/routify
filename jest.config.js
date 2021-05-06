const watchPathIgnorePatterns = [
    '/node_modules/',
    '/.routify/',
    '/build/',
    '/temp/',
    '/output/',
]

export default {
    rootDir: '.',
    transform: {},
    moduleNameMapper: {
        '^#lib(.+)$': '<rootDir>/lib$1',
    },
    watchPathIgnorePatterns,
    testTimeout: 2000,
    projects: [
        {
            displayName: 'unit',
            testMatch: [
                '**/test/unit/**/?(*.)+(spec|test).[jt]s?(x)',
                '**/lib/**/?(*.)+(spec|test).[jt]s?(x)',
            ],
            watchPathIgnorePatterns,
        },
        {
            displayName: 'integration',
            testMatch: ['**/test/integration/**/?(*.)+(spec|test).[jt]s?(x)'],
            watchPathIgnorePatterns,
        },
        {
            displayName: 'e2e',
            moduleNameMapper: {
                '^#lib(.+)$': '<rootDir>/lib$1',
            },
            testMatch: ['**/test/e2e/**/?(*.)+(spec|test).[jt]s?(x)'],
            preset: 'jest-playwright-preset',
            watchPathIgnorePatterns,
        },
    ],
}
