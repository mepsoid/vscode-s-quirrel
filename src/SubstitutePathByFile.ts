import * as vs from 'vscode';
import { promises as fs } from 'fs';
import * as path from 'path';

import {
  extractRequirePath, normalizeBackslashes, truncatePath, compareFileName
} from './utils';

const IGNORE_DIRS = ['node_modules', 'out', 'obj', 'bin', 'tmp'];

async function findFile(dir: string, filter: string) {
  let fileList: { [key: string]: number } = {};
  const files = await fs.readdir(dir);
  for (const file of files) {
    if (file.charAt(0) == '.' || IGNORE_DIRS.indexOf(file) >= 0)
      continue;
    const full = path.join(dir, file);
    const stat = await fs.stat(full);
    if (stat.isDirectory()) 
      Object.assign(fileList, await findFile(full, filter));
    else if (stat.isFile()) {
      const likeness = compareFileName(filter, file);
      if (likeness > 0)
        fileList[full] = likeness;
    }
  }
  return fileList;
}

function pad(num: number): string {
  return ('00000' + num.toString()).substr(-6);
}

export class SubstitutePathByFile implements vs.CompletionItemProvider {

  provideCompletionItems(
    document: vs.TextDocument, position: vs.Position,
    token: vs.CancellationToken, context: vs.CompletionContext
  ) {
    const line = document.lineAt(position).text;
    const currentPath = extractRequirePath(line, position.character);
    if (!currentPath)
      return undefined;

    return new Promise<vs.CompletionItem[]>(async (resolve) => {
      const result: vs.CompletionItem[] = [];
      const rangeLine = position.line;
      const range = new vs.Range(rangeLine, currentPath.begin, rangeLine, currentPath.end);
      const fileSrc = currentPath.name;
      const fileFull = normalizeBackslashes(path.normalize(fileSrc));
      const fileKind = fileFull.slice(-1) !== '/'
        ? vs.CompletionItemKind.File
        : vs.CompletionItemKind.Folder;
      const docFull = normalizeBackslashes(path.normalize(document.fileName));
      const { base: docName, dir: docPath } = path.parse(docFull);

      function appendCompletion(label: string, documentation?: string, sortText?: string) {
        const item =  new vs.CompletionItem(truncatePath(label));
        item.kind = fileKind;
        item.insertText = label;
        item.range = range;
        item.filterText = fileSrc;
        item.documentation = documentation;
        item.sortText = sortText;
        result.push(item);
      }

      if (path.isAbsolute(fileFull)) {
        // reduce absolute path relative to the document 
        if (fileFull.indexOf(docPath) === 0) {
          const pathReduced = fileFull.substr(docPath.length + 1);
          if (pathReduced.length > 0)
            appendCompletion(pathReduced, `Reduced to document relative: ./${docName}`);
        }

        // reduce absolute path relative to the workspaces
        const dirWorkspaces = vs.workspace.workspaceFolders || [];
        dirWorkspaces.forEach((wspace) => {
          const wsFull = normalizeBackslashes(path.normalize(wspace.uri.fsPath));
          if (fileFull.indexOf(wsFull) === 0) {
            const pathReduced = fileFull.substr(wsFull.length + 1);
            if (pathReduced.length > 0)
              appendCompletion(pathReduced, `Reduced to workspace relative: ~${wspace.name}`);
          }
        });
      } else {
        const { base: fileName } = path.parse(fileFull);

        // find relative path from the document
        const docRelated = await findFile(docPath, fileName);
        for (let path in docRelated) {
          const likeness = docRelated[path];
          path = normalizeBackslashes(path.substr(docPath.length + 1));
          appendCompletion(path, `Relative to document: ./${docName}`,
            `${pad(likeness)}${pad(path.length)}`);
        }

        // find relative path from workspaces
        const dirWorkspaces = vs.workspace.workspaceFolders || [];
        await Promise.all(dirWorkspaces.map(async (wspace) => {
          const wsPath = normalizeBackslashes(path.normalize(wspace.uri.fsPath));
          const wsRelated = await findFile(wsPath, fileName);
          for (let path in wsRelated) {
            const likeness = wsRelated[path];
            path = normalizeBackslashes(path.substr(wsPath.length + 1));
            appendCompletion(path, `Relative to workspace: ~${wspace.name}`,
              `${pad(likeness)}${pad(path.length)}`);
          }
        }));
      }
      resolve(result);
    });
  }

}
