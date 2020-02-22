import * as vs from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { extractRequirePath } from './utils';

function tryOpenDocument(filePath: string): boolean {
  const isFound = fs.existsSync(filePath);
  if (isFound)
    vs.workspace.openTextDocument(filePath)
      .then((doc: vs.TextDocument) =>
        vs.window.showTextDocument(doc)); // { preview: false }
  return isFound;
}

export default function openFileByPath() {
  const editor = vs.window.activeTextEditor;
  if (!editor) return;

  const line = editor.document.lineAt(editor.selection.active.line).text;
  let filePath = extractRequirePath(line);
  if (!filePath) return;

  filePath = path.normalize(filePath);
  if (path.isAbsolute(filePath)) {
    // absolute path
    tryOpenDocument(filePath);
    return;
  }

  // relative path from the current document
  const dirRelative = path.dirname(editor.document.fileName);
  const isRelative = tryOpenDocument(path.join(dirRelative, filePath));
  if (isRelative) return;

  // workspace relative paths
  const dirWorkspaces = vs.workspace.workspaceFolders;
  if (!dirWorkspaces) return;

  dirWorkspaces.forEach((dir: vs.WorkspaceFolder) =>
    tryOpenDocument(path.join(dir.uri.fsPath, filePath)));
}