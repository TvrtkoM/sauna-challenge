import { AppError } from "./constants";
import loadMap from "./loadMap";

describe("loadMap tests", () => {
  it("should throw error if invalid characters are found", () => {
    expect(() => loadMap("example16.txt")).toThrow(
      AppError.INVALID_CHARACTER_FOUND + "example16.txt"
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
