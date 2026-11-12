import { describe, expect, it } from "vitest";
import { canAccessModule, normalizeRole } from "./permissions";
describe("permissions", () => {
  it("normalizes manager roles", () => {
    expect(normalizeRole("Sales Manager")).toBe("manager");
    expect(normalizeRole("Sales Director")).toBe("manager");
  });
  it("restricts pipeline for employees", () => {
    expect(canAccessModule("employee", "pipeline")).toBe(false);
    expect(canAccessModule("employee", "leads")).toBe(true);
  });
  it("allows reports for sales reps and managers", () => {
    expect(canAccessModule("sales_rep", "reports")).toBe(true);
    expect(canAccessModule("employee", "reports")).toBe(false);
  });
});
