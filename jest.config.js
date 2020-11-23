const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  roots: ['<rootDir>'],
  preset: '@shelf/jest-mongodb',
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
  testTimeout: 30000,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src',
  }),
};
