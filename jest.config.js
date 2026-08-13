/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

const { createCjsPreset } = require('jest-preset-angular/presets');

const presetConfig = createCjsPreset({
  tsconfig: '<rootDir>/tsconfig.spec.json'
});

/** @type {import('jest').Config} */
const config = {
  ...presetConfig,

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ['node_modules', 'src'],

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'mjs', 'ts', 'json', 'html'],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^.+\\.(css|scss)$': 'identity-obj-proxy'
  },

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom'
};

module.exports = config;
