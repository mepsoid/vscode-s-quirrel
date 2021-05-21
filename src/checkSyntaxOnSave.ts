import * as vs from 'vscode';
import { exec } from 'child_process';
import syntaxDiags from './syntaxDiags';

type DiagnosticItem = {
  line: number;
  col: number;
  len: number;
  file: string;
  intId: number;
  textId: string;
  message: string;
  isError: boolean;
}

type DiagnosticResult = { messages: DiagnosticItem[]; }

const DIAGNOSTIC_SOURCE = 'Static analysis';
const ERRORCODE_UNUSED = [213, 221, 228];

const versionControl: {[key: string]: number;} = {};

export default function checkSyntaxOnSave(document: vs.TextDocument) {
  if (document.languageId !== 'squirrel')
    return;

  const srcPath = document.uri.fsPath;
  const version = document.version;
  if (versionControl[srcPath] === version)
    return;
  versionControl[srcPath] = version;

  const config = vs.workspace.getConfiguration('squirrel.syntaxChecker');
  let fileName: string = config.get('fileName') || '';
  fileName = process.env[fileName] || fileName;
  let options: string = config.get('optionsCheckCode') || '';
  options = options.replace(/\$\{source\}/gi, srcPath);

  exec(`${fileName} ${options}`, (error, stdout, stderr) => {
    if (stderr) {
      // TODO diagnose analyzer execution failure
      syntaxDiags.delete(document.uri);
      return;
    }

    if (error && !stdout) {
      // TODO diagnose different errorlevels
      syntaxDiags.clear();
      return;
    }

    const result: DiagnosticResult = JSON.parse(stdout);
    const messages = result?.messages || [];
    const diagList: vs.Diagnostic[] = messages.map((msg) => {
      const line = msg.line - 1;
      const col = msg.col - 1;
      const range = new vs.Range(line, col, line, col + msg.len);
      const severity = msg.isError
        ? vs.DiagnosticSeverity.Error
        : vs.DiagnosticSeverity.Warning;
      const errorCode = msg.intId;
      const diag = new vs.Diagnostic(range, msg.message, severity);
      diag.code = [errorCode, msg.textId].join(':');
      diag.source = DIAGNOSTIC_SOURCE;
      if (ERRORCODE_UNUSED.indexOf(errorCode) >= 0)
        diag.tags = [vs.DiagnosticTag.Unnecessary];
      return diag;
    });
    syntaxDiags.set(document.uri, diagList);
  });
}