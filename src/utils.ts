const REQUIRE_PATH = /\brequire\s*\([\s]*[$@]?\"([^\"]*)\"/;
const PATH_MAX = 44;

export function extractRequirePath(line: string): string {
  const result = REQUIRE_PATH.exec(line);
  return result ? result[1] : '';
}

export function normalizeBackslashes(backslashed: string): string {
  return backslashed ? backslashed.replace(/\\/g, '/') : backslashed;
}

export function compareFileName(filter: string, fileName: string): boolean {
  filter = (filter || '').toLowerCase();
  fileName = (fileName || '').toLowerCase();
  return fileName.indexOf(filter) >= 0;
}

export function truncatePath(path:string): string {
  const length = path.length;
  if (length <= PATH_MAX) return path;

  const last = path.lastIndexOf('/', length - 1);
  return path.substr(0, PATH_MAX - length + last) + '…' + path.substr(last);
}