import * as path from 'path';

const REQUIRE_PATH = /\brequire\s*\([\s]*[$@]?\"([^\"]*)\"/;

export function extractRequirePath(line: string): string|null {
  const result = REQUIRE_PATH.exec(line);
  return result ? path.normalize(result[1]) : null;
}
