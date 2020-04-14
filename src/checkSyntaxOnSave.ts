import * as vs from 'vscode';
import { exec } from 'child_process';

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

type DiagnosticResult = {
  messages: DiagnosticItem[];
}

const DIAGNOSTIC_SOURCE = 'Static analysis';
const ERRORCODE_UNUSED = [213, 221, 228];

const diagnostics = vs.languages.createDiagnosticCollection('squirrel');
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
  const fileName: string = config.get('fileName') || '';
  const fullPath: string = config.get('fullPath') || '';
  const envVar: string = config.get('envVar') || '';
  const options: string = config.get('options') || '';

  const finalPath = fileName ? fileName
    : fullPath ? fullPath
    : envVar ? process.env[envVar] || ''
    : '';
  const finalOptions = options.replace(/\$\{source\}/gi, srcPath);

  exec(`${finalPath} ${finalOptions}`, (error, stdout, stderr) => {
    const result: DiagnosticResult = JSON.parse(stdout);
    const messages = result?.messages;
    if (!result || !messages) {
      diagnostics.clear();
      return;
    }

    const diagList: vs.Diagnostic[] = messages.map((msg) => {
      const line = msg.line - 1;
      const col = msg.col - 1;
      const range = new vs.Range(line, col, line, col + msg.len);
      const severity = msg.isError
        ? vs.DiagnosticSeverity.Error
        : vs.DiagnosticSeverity.Warning;
      const errorCode = msg.intId;
      const diag = new vs.Diagnostic(range, msg.message, severity);
      diag.code = [msg.textId, errorCode].join(':');
      diag.source = DIAGNOSTIC_SOURCE;
      const tags = [];
      if (ERRORCODE_UNUSED.indexOf(errorCode) >= 0)
        tags.push(vs.DiagnosticTag.Unnecessary);
      // diag.tags = [vs.DiagnosticTag.Deprecated, vs.DiagnosticTag.Unnecessary];
      if (tags.length)
        diag.tags = tags;
      return diag;
    });
    diagnostics.set(document.uri, diagList);
  });
}