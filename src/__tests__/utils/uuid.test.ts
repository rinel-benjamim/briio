import { generateId } from "@/utils/uuid";

describe("generateId", () => {
  it("generates a string", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
  });

  it("generates a UUID v4 format", () => {
    const id = generateId();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it("generates unique IDs", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it("generates IDs with correct length", () => {
    const id = generateId();
    expect(id.length).toBe(36);
  });
});
