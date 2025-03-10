import { AppError } from "./constants";
import { PathChar, Point } from "./types";

export default function findStartingPoint(pathMap: string[][]): Point {
  let startingPoint: Point | undefined;
  let numStarting = 0;

  for (let y = 0; y < pathMap.length; y++) {
    for (let x = 0; x < pathMap[y].length; x++) {
      if (pathMap[y][x] === PathChar.Start) {
        startingPoint = { x, y };
        numStarting++;
      }
    }
  }

  if (startingPoint === undefined) {
    throw Error(AppError.NO_STARTING_POINT);
  }

  if (numStarting > 1) {
    throw Error(AppError.MULTIPLE_STARTING_POINTS);
  }

  return startingPoint;
}
