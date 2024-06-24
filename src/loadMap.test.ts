import loadMap from "./loadMap";

describe("loadMap tests", () => {
  it("should throw error if invalid characters are found", () => {
    expect(() => loadMap("example16.txt")).toThrow(
      "Invalid character found in given map file example16.txt"
    );
  });
  it("should return a path map", () => {
    const res = loadMap("example1.txt");

    expect(JSON.stringify(res)).toBe(
      JSON.stringify([
        [" ", " ", "@", "-", "-", "-", "A", "-", "-", "-", "+"],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "|"],
        [" ", " ", "x", "-", "B", "-", "+", " ", " ", " ", "C"],
        [" ", " ", " ", " ", " ", " ", "|", " ", " ", " ", "|"],
        [" ", " ", " ", " ", " ", " ", "+", "-", "-", "-", "+"]
      ])
    );
  });
});
