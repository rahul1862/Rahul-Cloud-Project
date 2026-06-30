import { test } from "node:test";
import assert from "node:assert/strict";

process.env.NODE_ENV = "test";
const { validate } = await import("../app.js");

test("validate rejects a name shorter than 2 characters", () => {
  const errors = validate({ name: "A", email: "a@b.com", address: "123 Main Street" });
  assert.equal(errors.name, "Must be at least 2 characters");
});

test("validate rejects a malformed email", () => {
  const errors = validate({ name: "Alice Smith", email: "not-an-email", address: "123 Main Street" });
  assert.ok(errors.email);
});

test("validate rejects an address shorter than 5 characters", () => {
  const errors = validate({ name: "Alice Smith", email: "alice@example.com", address: "Rd" });
  assert.ok(errors.address);
});

test("validate returns no errors for valid input", () => {
  const errors = validate({ name: "Alice Smith", email: "alice@example.com", address: "123 Main Street" });
  assert.deepEqual(errors, {});
});
