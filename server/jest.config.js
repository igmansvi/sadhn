export default {
  testEnvironment: "node",
  testTimeout: 30000,
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  maxWorkers: 1,
};
