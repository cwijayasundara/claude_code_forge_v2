/**
 * Eval sample: Poor test quality — mocks business logic, generic data, no error paths.
 * Expected: code-reviewer should WARN on all issues.
 */
import { describe, it, expect, vi } from "vitest";

describe("ExtractionService", () => {
  it("extraction works", () => {
    // VIOLATION: Mocking business logic instead of external boundaries
    const mockExtract = vi.fn().mockReturnValue({ status: "ok" });
    const result = mockExtract("test123"); // VIOLATION: Generic test data
    expect(result.status).toBe("ok"); // VIOLATION: Testing the mock, not the code
  });

  it("upload works", () => {
    // VIOLATION: No assertion on behavior, just that it doesn't crash
    const doc = {
      name: "test.pdf", // VIOLATION: Generic filename
      size: 100,
    };
    // No actual service call, no meaningful assertion
    expect(doc.name).toBe("test.pdf");
  });

  it("validation works", () => {
    // VIOLATION: No error path tests — only happy path
    const result = { field1: "value1", field2: "value2" };
    expect(Object.keys(result)).toHaveLength(2);
    // Missing: test with empty fields, missing fields, invalid types, confidence below threshold
  });
});
