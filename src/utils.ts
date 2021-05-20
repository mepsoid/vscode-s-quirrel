const PATH_MAX = 50;
const MIN_FOUND_SYMBOLS = 2;

export type ExtractedPath = { begin: number, end: number; name: string };

export function extractRequirePath(line: string, index: number): ExtractedPath | null {
  const pattern = /\brequire\s*\(\s*[$@]?\"([^\"]*)\"/g;
  let result: RegExpExecArray | null;
  while ((result = pattern.exec(line)) != null) {
    const name = result[1];
    const begin = line.indexOf(name, result.index);
    const end = begin + name.length;
    if (begin <= index && index <= end)
      return { begin, end, name };
  }
  return null;
}

export function normalizeBackslashes(backslashed: string): string {
  return backslashed ? backslashed.replace(/\\/g, '/') : backslashed;
}

export function compareFileName(part: string, fileName: string): number {
  if (fileName.indexOf(part) >= 0)
    return 1;

  part = part.toLowerCase();
  fileName = fileName.toLowerCase();
  if (fileName.indexOf(part) >= 0)
    return 2;

  let count = 0;
  let lastFound = -1;
  for (let index = 0; index < part.length; ++index) {
    let found = fileName.indexOf(part.charAt(index), lastFound + 1);
    if (found < 0)
      break;

    lastFound = found;
    ++count;
  }
  return count >= MIN_FOUND_SYMBOLS ? part.length - count + 3 : 0;
}

export function truncatePath(path:string): string {
  const length = path.length;
  if (length <= PATH_MAX)
    return path;

  const last = path.lastIndexOf('/', length - 1);
  return path.substr(0, PATH_MAX - length + last) + '…' + path.substr(last);
}