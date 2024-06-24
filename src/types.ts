export enum Direction {
  TOP = "top",
  RIGHT = "right",
  BOTTOM = "bottom",
  LEFT = "left"
}

export enum PathChar {
  Start = "@",
  End = "x",
  Crossroad = "+",
  Vertical = "|",
  Horizontal = "-",
  Empty = " "
}

export const isPathChar = (char: string): char is PathChar => {
  return ["@", "x", "+", "|", "-", " "].includes(char);
};

export type Point = { x: number; y: number };
