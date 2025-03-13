module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
      "^src/(.*)$": "<rootDir>/src/$1"
    },
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    testEnvironment: 'node',
    // other Jest configurations
  };
  