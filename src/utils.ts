const PATH_MAX = 50;
const MAX_FRAGMENTS= 3;

export function extractRequirePath(line: string, index: number):
    { begin: number, end: number; value: string } | null
{
  const pattern = /\brequire\s*\(\s*[$@]?\"([^\"]*)\"/g;
  let result: RegExpExecArray | null;
  while ((result = pattern.exec(line)) != null) {
    const value = result[1];
    const begin = line.indexOf(value, result.index);
    const end = begin + value.length;
    if (begin <= index && index <= end)
      return { begin, end, value };
  }
  return null;
}

export function extractKeyBefore(line: string, index: number):
    { begin: number, end: number; value: string; delimiter: string } | null
{
  const pattern = /(\w+)(\s*)=/g;
  let result: RegExpExecArray | null;
  let found = null;
  while ((result = pattern.exec(line)) != null) {
    const value = result[1];
    const begin = line.indexOf(value, result.index);
    if (begin > index)
      break;

    const end = begin + value.length;
    const delimiter = result[2];
    found = { begin, end, value, delimiter };
  }
  return found;
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

  let fragments = 1;
  let count = 0;
  let lastFound = -1;
  for (let index = 0; index < part.length; ++index) {
    let found = fileName.indexOf(part.charAt(index), lastFound + 1);
    if (found < 0)
      break;

    if (found > lastFound + 1)
      ++fragments;
    lastFound = found;
    ++count;
  }
  return count < part.length || MAX_FRAGMENTS < fragments ? 0 : fragments + 2;
}

export function truncatePath(path:string): string {
  const length = path.length;
  if (length <= PATH_MAX)
    return path;

  const last = path.lastIndexOf('/', length - 1);
  return path.substr(0, PATH_MAX - length + last) + '…' + path.substr(last);
}