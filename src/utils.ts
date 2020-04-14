const PATH_MAX = 41;

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

export function compareFileName(part: string, fileName: string): boolean {
  part = (part || '').toLowerCase();
  fileName = (fileName || '').toLowerCase();
  return fileName.indexOf(part) >= 0;
}

export function truncatePath(path:string): string {
  const length = path.length;
  if (length <= PATH_MAX)
    return path;

  const last = path.lastIndexOf('/', length - 1);
  return path.substr(0, PATH_MAX - length + last) + '…' + path.substr(last);
}