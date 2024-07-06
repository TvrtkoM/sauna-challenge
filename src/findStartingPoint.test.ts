import { AppError } from "./constants";
import findStartingPoint from "./findStartingPoint";

describe("findStartingPoint", () => {
  it("should find coordinates of the starting point correctly", () => {
    const testPath = [
      [" ", "x", "-", "-", "+"],
      [" ", " ", "+", "-", "+"],
      [" ", " ", "|"],
      [" ", "@", "+"]
    ];
    const point = findStartingPoint(testPath);

    expect(point.x).toBe(1);
    expect(point.y).toBe(3);
  });

  it("should throw error if there are multiple starting points", () => {
    const testPath = [
      [" ", "x", "-", "-", "@"],
      [" ", " ", "+", "-", "+"],
      [" ", " ", "|"],
      [" ", "@", "+"]
    ];
    expect(() => findStartingPoint(testPath)).toThrow(
      AppError.MULTIPLE_STARTING_POINTS
    );
  });

  it("should throw error if there are no starting points", () => {
    const testPath = [
      [" ", "x", "-", "-", "+"],
      [" ", " ", "+", "-", "+"],
      [" ", " ", "|"],
      [" ", "-", "+"]
    ];
    expect(() => findStartingPoint(testPath)).toThrow(
      AppError.NO_STARTING_POINT
    );
  });
});
