import fs from "fs";
import path from "path";
import checkValidCharsInLine from "./util/checkValidCharsInLine";

const cwd = path.resolve(__dirname);

export default function loadMap(fileName: string): string[][] {
  const file = fs.readFileSync(
    path.resolve(cwd, "examples", fileName),
    "utf-8"
  );
  const hasEnd = Boolean(file.includes("x"));
  if (!hasEnd) {
    throw Error("No end found");
  }
  const lines = file.split(/\r?\n/).map((l) => l.trimEnd());
  const pathMap = [];
  let row = 0;

  for (const line of lines) {
    if (line && !checkValidCharsInLine(line)) {
      throw Error("Invalid character found in given map file " + fileName);
    }

    pathMap[row] = line.split("");
    row += 1;
  }

  return pathMap;
}
