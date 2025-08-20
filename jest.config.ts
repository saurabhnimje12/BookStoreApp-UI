import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }],
  },
  setupFilesAfterEnv: [
    "<rootDir>/src/jest.setup.ts", // ✅ custom setup file
    "@testing-library/jest-dom",   // ✅ adds matchers like toBeInTheDocument
  ],
};

export default config;
