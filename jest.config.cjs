module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.cjs'],
    testMatch: ['<rootDir>/src/__tests__/**/*.test.{ts,tsx}'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@assets/(.*)$': '<rootDir>/src/assets/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@context/(.*)$': '<rootDir>/src/context/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@types/(.*)$': '<rootDir>/src/types/$1',
        '\\.(css|scss|sass)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.(t|j)sx?$': [
            'ts-jest',
            {
                tsconfig: '<rootDir>/tsconfig.test.json',
            },
        ],
    },
};
