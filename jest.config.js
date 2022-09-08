/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/test/jest/styleMock.js',
  },
  "transform": {
    /* "^.+\\.js?$": "babel-jest",
    "^.+\\.ts?$": "ts-jest" */
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx|css|scss)?$": "babel-jest"
  },
  "testMatch": [
    "**/__tests__/**/*.+(ts)",
    "**/?(*.)+(spec|test).+(ts)"
  ],
  "moduleFileExtensions": [
    "ts", "js"
  ],
  cacheDirectory: '.jest-cache'
};
