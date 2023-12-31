/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  // roots: ['<rootDir>/test'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  moduleNameMapper: {'^.+\\.(css|less)$': '<rootDir>/config/CSSStub.js'}, // to import css, example: "import './style.css';"
  testEnvironment: 'node',  // to be able to use structuredClone
};

