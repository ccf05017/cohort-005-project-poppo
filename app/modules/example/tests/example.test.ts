import { describe, it, expect } from "vitest";
import { greet } from "../index";

describe("greet", () => {
  it("greets by name", () => {
    expect(greet(" Ada ")).toBe("Hello, Ada!");
  });

  it("falls back when no name is given", () => {
    expect(greet("   ")).toBe("Hello, stranger!");
  });
});
