import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { slugify, validatePaletteName } from "./naming";

describe("slugify", () => {
  it("makes kebab-case slugs", () => {
    assert.equal(slugify("Forest Green"), "forest-green");
    assert.equal(slugify("  Deep   Sea--Blue! "), "deep-sea-blue");
    assert.equal(slugify("Æble Rød"), "aeble-rod");
    assert.equal(slugify("Café Crème"), "cafe-creme");
  });
});

describe("validatePaletteName", () => {
  it("accepts good names", () => {
    assert.equal(validatePaletteName("Forest Green", []), null);
    assert.equal(validatePaletteName("Brand Blue", ["forest-green"]), null);
  });
  it("rejects empty and symbol-only names", () => {
    assert.ok(validatePaletteName("", []));
    assert.ok(validatePaletteName("!!!", []));
  });
  it("rejects Tailwind colour names", () => {
    assert.match(validatePaletteName("Blue", [])!, /Tailwind/);
    assert.match(validatePaletteName("slate", [])!, /Tailwind/);
  });
  it("rejects shadcn token names", () => {
    assert.match(validatePaletteName("Primary", [])!, /shadcn/);
  });
  it("rejects duplicates and names ending in a number", () => {
    assert.match(validatePaletteName("forest green", ["forest-green"])!, /already exists/);
    assert.ok(validatePaletteName("Green 2", []));
    assert.ok(validatePaletteName("2 Green", []));
  });
});
