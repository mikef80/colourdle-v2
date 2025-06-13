import { JestConfigWithTsJest } from "ts-jest";
// require("dotenv").config({ path: ".env.test" });

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  setupFiles: ["<rootDir>/tests/setup-env.ts"],
  setupFilesAfterEnv: ["jest-extended/all"],
};

export default jestConfig;
