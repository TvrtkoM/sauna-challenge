const validCharsRegex = /^[A-Z@x\+|-\s]+$/;

export default function checkValidCharsInLine(line: string): boolean {
  return validCharsRegex.test(line);
}
