import { JestConfigWithTsJest } from "ts-jest";
require("dotenv").config({ path: ".env.test" });

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  setupFilesAfterEnv: ["jest-extended/all"],
};

export default config;
