declare namespace _default {
    const projects: ({
        displayName: string;
        testEnvironment: string;
        testMatch: string[];
        watchPathIgnorePatterns: string[];
        moduleNameMapper: {
            '^#lib(.+)$': string;
            '^#root(.+)$': string;
        };
        testTimeout: number;
        modulePaths: string[];
        roots: string[];
        transform: {
            '^.+\\.svelte$': (string | {
                preprocess: boolean;
            })[];
        };
    } | {
        displayName: string;
        moduleNameMapper: {
            '^#lib(.+)$': string;
        };
        testMatch: string[];
        preset: string;
        globalSetup: string;
        globalTeardown: string;
        watchPathIgnorePatterns: string[];
        testTimeout: number;
        modulePaths: string[];
        roots: string[];
        transform: {
            '^.+\\.svelte$': (string | {
                preprocess: boolean;
            })[];
        };
    } | {
        displayName: string;
        preset: string;
        testMatch: string[];
        watchPathIgnorePatterns: string[];
        moduleNameMapper: {
            '^#lib(.+)$': string;
            '^#root(.+)$': string;
        };
        testTimeout: number;
        modulePaths: string[];
        roots: string[];
        transform: {
            '^.+\\.svelte$': (string | {
                preprocess: boolean;
            })[];
        };
    })[];
    const watchPathIgnorePatterns: string[];
    const moduleNameMapper: {
        '^#lib(.+)$': string;
        '^#root(.+)$': string;
    };
    const testTimeout: number;
    const modulePaths: string[];
    const roots: string[];
    const transform: {
        '^.+\\.svelte$': (string | {
            preprocess: boolean;
        })[];
    };
}
export default _default;
