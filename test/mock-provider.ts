import { provider } from "./test-env";

jest.mock("../src/provider", () => ({
  getProvider: jest.fn(() => provider),
}));
