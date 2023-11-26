import * as vs from 'vscode';
import { exec } from 'child_process';
import syntaxDiags from './syntaxDiags';
import { dbgOutputChannel } from './utils';

const DIAGNOSTIC_SOURCE = 'Code runner';

function checkCompileError(diagList: vs.Diagnostic[], message: string) {
  const pattern = /line = \((\d+)\).*column = \((\d+)\).*:\s*(.*)/gi;
  let result: RegExpExecArray | null;
  while ((result = pattern.exec(message)) != null) {
    const line = +result[1] - 1;
    const col = +result[2] - 1;
    const range = new vs.Range(line, col, line, col + 4); // TODO measure or get token length from analyzer
    const diag = new vs.Diagnostic(range, result[3], vs.DiagnosticSeverity.Error);
    diag.source = DIAGNOSTIC_SOURCE;
    diagList.push(diag);
  }
}

function checkRuntimeError(diagList: vs.Diagnostic[], message: string, document: vs.TextDocument) {
  const errorPattern = /AN ERROR HAS OCCURRED\s*\[(.*)\]/g;
  const errorResult = errorPattern.exec(message);
  if (errorResult == null)
    return;

  const rangePattern = /CALLSTACK\r?\n.*line \[(\d+)\]/gm;
  const rangeResult = rangePattern.exec(message);
  if (rangeResult == null)
    return;

  const line = +rangeResult[1] - 1;
  const range = document.lineAt(line).range
  const diag = new vs.Diagnostic(range, errorResult[1], vs.DiagnosticSeverity.Error);
  diag.source = DIAGNOSTIC_SOURCE;
  diagList.push(diag);
}

export default function runDocumentCode() {
  const editor = vs.window.activeTextEditor;
  if (!editor)
    return;

  const document = editor.document;
  const srcPath = document.uri.fsPath;
  dbgOutputChannel.show(true);
  dbgOutputChannel.appendLine(`Running file: ${srcPath}`);

  const config = vs.workspace.getConfiguration('squirrel.codeRunner');
  let toolPath: string = config.get('fileName') || '';
  toolPath = process.env[toolPath] || toolPath;
  let cmd: string = `${toolPath} ${srcPath}`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      dbgOutputChannel.appendLine(stdout);

      const diagList: vs.Diagnostic[] = [];
      checkCompileError(diagList, stdout);
      checkRuntimeError(diagList, stdout, document);

      if (diagList.length)
        syntaxDiags.set(document.uri, diagList);
      return;
    }

    dbgOutputChannel.appendLine(stdout);
    dbgOutputChannel.appendLine('');
  });
}