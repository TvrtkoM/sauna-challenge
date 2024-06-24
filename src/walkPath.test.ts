import { Direction } from "./types";
import walkPath, {
  getFromDirection,
  isIntersection,
  isValidStep
} from "./walkPath";

describe("walkPath", () => {
  it("solves example 1 correctly", () => {
    const { letters, path } = walkPath("example1.txt");

    expect(letters).toBe("ACB");
    expect(path).toBe("@---A---+|C|+---+|+-B-x");
  });
  it("solves example 2 correctly", () => {
    const { letters, path } = walkPath("example2.txt");

    expect(letters).toBe("ABCD");
    expect(path).toBe("@|A+---B--+|+--C-+|-||+---D--+|x");
  });
  it("solves example 3 correctly", () => {
    const { letters, path } = walkPath("example3.txt");

    expect(letters).toBe("ACB");
    expect(path).toBe("@---A---+|||C---+|+-B-x");
  });
  it("solves example 4 correctly", () => {
    const { letters, path } = walkPath("example4.txt");

    expect(letters).toBe("GOONIES");
    expect(path).toBe("@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x");
  });
  it("solves example 5 correctly", () => {
    const { letters, path } = walkPath("example5.txt");

    expect(letters).toBe("BLAH");
    expect(path).toBe("@B+++B|+-L-+A+++A-+Hx");
  });
  it("solves example 6 correctly", () => {
    const { letters, path } = walkPath("example6.txt");

    expect(letters).toBe("AB");
    expect(path).toBe("@-A--+|+-B--x");
  });
  it("solves example 17 correctly", () => {
    const { letters, path } = walkPath("example17.txt");
    expect(letters).toBe("ACB");
    expect(path).toBe("@--A|C|+---+|+-B-x");
  });
  it("has missing start character on example 7", () => {
    expect(() => walkPath("example7.txt")).toThrow("No starting point found");
  });
  it("has missing end character on example 8", () => {
    expect(() => walkPath("example8.txt")).toThrow("No end found");
  });
  it("has multiple starting points in example 9", () => {
    expect(() => walkPath("example9.txt")).toThrow(
      "Multiple starting points found"
    );
  });
  it("has multiple starting points in example 10", () => {
    expect(() => walkPath("example10.txt")).toThrow(
      "Multiple starting points found"
    );
  });
  it("has multiple starting points in example 11", () => {
    expect(() => walkPath("example11.txt")).toThrow(
      "Multiple starting points found"
    );
  });
  it("has fork in path in example 12", () => {
    expect(() => walkPath("example12.txt")).toThrow("Multiple sides");
  });
  it("has broken path in example 13", () => {
    expect(() => walkPath("example13.txt")).toThrow("No side");
  });
  it("has multiple starting directions in example 14", () => {
    expect(() => walkPath("example14.txt")).toThrow("Multiple sides");
  });
  it("has fake turn in example 15", () => {
    expect(() => walkPath("example15.txt")).toThrow("Fake turn");
  });
});

describe("isIntersection", () => {
  it("tests if it is intersection type #1", () => {
    const pathMap = [
      [" ", "|", " "],
      ["-", "|", "-"],
      [" ", "|", " "]
    ];
    const point = { x: 1, y: 1 };

    expect(isIntersection(pathMap, point)).toBe(true);
  });
  it("tests if it is intersection type #2", () => {
    const pathMap = [
      [" ", "|", " "],
      ["-", "-", "-"],
      [" ", "|", " "]
    ];
    const point = { x: 1, y: 1 };

    expect(isIntersection(pathMap, point)).toBe(true);
  });
});

describe("isValidStep", () => {
  it("checks some invalid steps", () => {
    expect(isValidStep("-", "@", Direction.RIGHT)).toBe(false);
    expect(isValidStep("-", "|", Direction.RIGHT)).toBe(false);
    expect(isValidStep("@", "|", Direction.RIGHT)).toBe(false);
    expect(isValidStep("A", "|", Direction.LEFT)).toBe(false);
    expect(isValidStep("A", "-", Direction.BOTTOM)).toBe(false);
    expect(isValidStep("B", "-", Direction.TOP)).toBe(false);
  });
  it("checks some valid steps", () => {
    expect(isValidStep("-", "+", Direction.RIGHT)).toBe(true);
    expect(isValidStep("@", "-", Direction.LEFT)).toBe(true);
    expect(isValidStep("+", "-", Direction.RIGHT)).toBe(true);
    expect(isValidStep("A", "-", Direction.LEFT)).toBe(true);
    expect(isValidStep("B", "-", Direction.RIGHT)).toBe(true);
    expect(isValidStep("|", "x", Direction.TOP)).toBe(true);
  });
});

describe("getFromDirection", () => {
  it("can't get direction if no point is provided", () => {
    expect(getFromDirection()).toBe(null);
    expect(getFromDirection({ x: 1, y: 1 })).toBe(null);
  });
  it("gets direction correctly if both points provided", () => {
    expect(getFromDirection({ x: 1, y: 1 }, { x: 1, y: 2 })).toBe(
      Direction.TOP
    );
    expect(getFromDirection({ x: 1, y: 2 }, { x: 1, y: 1 })).toBe(
      Direction.BOTTOM
    );
    expect(getFromDirection({ x: 1, y: 1 }, { x: 2, y: 1 })).toBe(
      Direction.LEFT
    );
    expect(getFromDirection({ x: 2, y: 1 }, { x: 1, y: 1 })).toBe(
      Direction.RIGHT
    );
  });
});
