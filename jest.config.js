module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>test/setupTests.js'],
    moduleNameMapper: {
        '\\.(css|scss)$': '<rootDir>/test/mocks/styleMock.js',
    },
};
