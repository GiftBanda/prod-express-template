import { describe, expect, it } from "vitest";

import { sum } from "#utils/sum.js";

describe("sum function", () => {
  it("should return the sum of two numbers", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
