import findStartingPoint from "./findStartingPoint";
import loadMap from "./loadMap";
import { Direction, isPathChar, PathChar, Point } from "./types";

const isLetter = (char: string) => /^[A-Z]$/.test(char);

type Sides = {
  [direction in Direction]: string | null;
};

const getSides = (pathMap: string[][], currPoint: Point): Sides => {
  const top = pathMap[currPoint.y - 1]?.[currPoint.x] ?? null;
  const bottom = pathMap[currPoint.y + 1]?.[currPoint.x] ?? null;
  const left = pathMap[currPoint.y]?.[currPoint.x - 1] ?? null;
  const right = pathMap[currPoint.y]?.[currPoint.x + 1] ?? null;

  return {
    [Direction.TOP]: top,
    [Direction.BOTTOM]: bottom,
    [Direction.LEFT]: left,
    [Direction.RIGHT]: right
  };
};

export const getFromDirection = (currPoint?: Point, lastVisited?: Point) => {
  if (!lastVisited || !currPoint) return null;
  if (currPoint.x > lastVisited.x) {
    return Direction.RIGHT;
  }
  if (currPoint.x < lastVisited.x) {
    return Direction.LEFT;
  }
  if (currPoint.y < lastVisited.y) {
    return Direction.TOP;
  }
  return Direction.BOTTOM;
};

const getNextPoint = (currPoint: Point, direction: Direction) => {
  if (direction === Direction.TOP) {
    return { ...currPoint, y: currPoint.y - 1 };
  }
  if (direction === Direction.BOTTOM) {
    return { ...currPoint, y: currPoint.y + 1 };
  }
  if (direction === Direction.LEFT) {
    return { ...currPoint, x: currPoint.x - 1 };
  }
  return { ...currPoint, x: currPoint.x + 1 };
};

export const isValidStep = (
  current: string,
  next: string,
  direction: Direction
): boolean => {
  const isCurrentLetter = isLetter(current);
  const isNextLetter = isLetter(next);

  const checkNextTopBottomPathChar =
    isPathChar(next) &&
    [Direction.TOP, Direction.BOTTOM].includes(direction) &&
    [PathChar.Vertical, PathChar.Crossroad, PathChar.End].includes(next);

  const checkNextLeftRightPathChar =
    isPathChar(next) &&
    [Direction.LEFT, Direction.RIGHT].includes(direction) &&
    [PathChar.Horizontal, PathChar.Crossroad, PathChar.End].includes(next);

  const checkNextPathChar =
    checkNextLeftRightPathChar || checkNextTopBottomPathChar;

  if (current === PathChar.Start || isCurrentLetter) {
    return isNextLetter || checkNextPathChar;
  }
  if (current === PathChar.Crossroad) {
    return isNextLetter || checkNextPathChar;
  }
  if (current === PathChar.Horizontal) {
    return isNextLetter || checkNextLeftRightPathChar;
  }
  if (current === PathChar.Vertical) {
    return isNextLetter || checkNextTopBottomPathChar;
  }
  return false;
};

export const isIntersection = (pathMap: string[][], point: Point) => {
  const sides = getSides(pathMap, point);
  const val = pathMap[point.y][point.x];
  return (
    (val === "-" || val === "|" || isLetter(val)) &&
    sides["top"] === "|" &&
    sides["bottom"] === "|" &&
    sides["left"] === "-" &&
    sides["right"] === "-"
  );
};

const isPointVisited = (visitedPoints: Point[], point: Point) => {
  return Boolean(visitedPoints.find((p) => p.x === point.x && p.y === point.y));
};

const getOppositeDirection = (dir: Direction) => {
  if (dir === Direction.TOP) return Direction.BOTTOM;
  if (dir === Direction.BOTTOM) return Direction.TOP;
  if (dir === Direction.LEFT) return Direction.RIGHT;
  return Direction.LEFT;
};

const findNext = (
  pathMap: string[][],
  currPoint: Point,
  visitedPoints: Point[]
): { value: string; point: Point } => {
  const sides = getSides(pathMap, currPoint);
  const currVal = pathMap[currPoint.y][currPoint.x];
  const lastPoint = visitedPoints[visitedPoints.length - 1];
  const fromDirection = getFromDirection(lastPoint, currPoint);

  const isVisited = isPointVisited(visitedPoints, currPoint);

  const sidesEntries = Object.entries(sides);

  let validSides: string[] = [];

  // handles visited paths in crossroads, direction is opposite of direction we come from
  if (
    [PathChar.Vertical, PathChar.Horizontal].includes(currVal as PathChar) &&
    isVisited &&
    fromDirection
  ) {
    const oppositeDir = getOppositeDirection(fromDirection);
    const nextPoint = getNextPoint(currPoint, oppositeDir);
    return { value: pathMap[nextPoint.y][nextPoint.x], point: nextPoint };
  } else {
    // collect all possible directions / sides
    for (const [direction, value] of sidesEntries) {
      if (value === null || value === " ") {
        continue;
      }
      const nextPoint = getNextPoint(currPoint, direction as Direction);
      const intersection = isIntersection(pathMap, nextPoint);

      if (intersection) {
        validSides.push(direction);
      } else if (isValidStep(currVal, value, direction as Direction)) {
        validSides.push(direction);
      }
    }
  }

  // we don't want to go back
  validSides = validSides.filter((side) => side !== fromDirection);

  // if we're on the letter and there are multiple valid sides, continue in same direction
  if (isLetter(currVal) && validSides.length > 1 && fromDirection) {
    const oppositeDir = getOppositeDirection(fromDirection);
    const nextPoint = getNextPoint(currPoint, oppositeDir);
    return { value: pathMap[nextPoint.y][nextPoint.x], point: nextPoint };
  }

  if (validSides.length === 0) {
    throw new Error("No side");
  }
  if (validSides.length !== 1) {
    throw new Error("Multiple sides");
  }
  const validSide = validSides[0];

  if (
    currVal === "+" &&
    fromDirection &&
    getOppositeDirection(fromDirection) === validSide
  ) {
    throw Error("Fake turn");
  }

  const nextPoint = getNextPoint(currPoint, validSide as Direction);
  return { value: pathMap[nextPoint.y][nextPoint.x], point: nextPoint };
};

export default function walkPath(filename: string): {
  letters: string;
  path: string;
} {
  const pathMap = loadMap(filename);
  const startingPoint = findStartingPoint(pathMap);
  const visitedPoints: Point[] = [];

  const letters: string[] = [];
  const path: string[] = [PathChar.Start];

  let { value: nextVal, point: nextPoint } = findNext(
    pathMap,
    startingPoint,
    visitedPoints
  );

  visitedPoints.push(startingPoint);

  while (nextVal !== PathChar.End) {
    if (isLetter(nextVal) && !isPointVisited(visitedPoints, nextPoint)) {
      letters.push(nextVal);
    }
    path.push(nextVal);
    const next = findNext(pathMap, nextPoint, visitedPoints);
    visitedPoints.push(nextPoint);
    nextVal = next.value;
    nextPoint = next.point;
  }

  path.push(PathChar.End);

  return {
    letters: letters.join(""),
    path: path.join("")
  };
}
