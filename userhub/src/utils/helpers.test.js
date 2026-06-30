import { describe, expect, test } from "vitest";
import { initials, fmtDate, avatarColor, validateUser } from "./helpers";

describe("initials", () => {
  test("takes the first letter of the first two words", () => {
    expect(initials("Alice Smith")).toBe("AS");
  });

  test("uppercases single-word names", () => {
    expect(initials("alice")).toBe("A");
  });

  test("returns an empty string for no input", () => {
    expect(initials()).toBe("");
  });
});

describe("fmtDate", () => {
  test("formats an ISO string as day month year", () => {
    expect(fmtDate("2026-03-05T12:00:00.000Z")).toBe("5 Mar 2026");
  });
});

describe("avatarColor", () => {
  test("is deterministic for the same name", () => {
    expect(avatarColor("Alice Smith")).toBe(avatarColor("Alice Smith"));
  });

  test("returns one of the known palette classes", () => {
    expect(avatarColor("Alice Smith")).toMatch(/^bg-\w+-100/);
  });
});

describe("validateUser", () => {
  test("flags a name shorter than 2 characters", () => {
    const { valid, errors } = validateUser({ name: "A", email: "a@b.com", address: "123 Main Street" });
    expect(valid).toBe(false);
    expect(errors.name).toBeTruthy();
  });

  test("flags a malformed email", () => {
    const { valid, errors } = validateUser({ name: "Alice Smith", email: "nope", address: "123 Main Street" });
    expect(valid).toBe(false);
    expect(errors.email).toBeTruthy();
  });

  test("flags an address shorter than 5 characters", () => {
    const { valid, errors } = validateUser({ name: "Alice Smith", email: "alice@example.com", address: "Rd" });
    expect(valid).toBe(false);
    expect(errors.address).toBeTruthy();
  });

  test("is valid when every field passes", () => {
    const { valid, errors } = validateUser({ name: "Alice Smith", email: "alice@example.com", address: "123 Main Street" });
    expect(valid).toBe(true);
    expect(errors).toEqual({});
  });
});
