import * as vs from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { exec } from 'child_process';
import syntaxDiags from './syntaxDiags';
import { dbgOutputChannel } from './utils';

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

function processDiagOutput(diagOutput: string | null, document: vs.TextDocument) {
  if (diagOutput == null) {
    syntaxDiags.delete(document.uri);
    return;
  }

  const result: DiagnosticResult = JSON.parse(diagOutput);
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
}


export default function checkSyntaxOnSave(document: vs.TextDocument) {
  if (document.languageId !== 'squirrel')
    return;

  const srcPath = document.uri.fsPath;
  const version = document.version;
  if (versionControl[srcPath] === version)
    return;
  versionControl[srcPath] = version;

  const codeAnalysisConfig = vs.workspace.getConfiguration('squirrel.codeAnalysis');
  let analysisCommand: string = codeAnalysisConfig.get('command') || '';
  analysisCommand = process.env[analysisCommand] || analysisCommand;
  if (analysisCommand.trim() !== '') {
    // use arbitrary source code analysis tool
    const tempFilePath = path.join(os.tmpdir(), 'quirrel-diag.json');
    analysisCommand = analysisCommand.replace(/\$SRC_FILE/g, srcPath);
    analysisCommand = analysisCommand.replace(/\$DIAG_JSON/g, tempFilePath);

    fs.unlinkSync(tempFilePath);

    dbgOutputChannel.appendLine("Executing: " + analysisCommand);

    exec(analysisCommand, (error, stdout, stderr) => {
      // Ignore return code, check only output file, since found errors are not a failure

      fs.readFile(tempFilePath, 'utf8', (err, data) => {
        if (err) {
          dbgOutputChannel.appendLine("Error reading file: " + err.message);
          // TODO diagnose file reading failure
          processDiagOutput(null, document);
        }
        else {
          processDiagOutput(data, document);
        }
      });
    });

    fs.unlinkSync(tempFilePath);
  }
  else {
    // use arbitrary legacy static analyser
    const syntaxCheckerConfig = vs.workspace.getConfiguration('squirrel.syntaxChecker');
    let toolPath: string = syntaxCheckerConfig.get('fileName') || '';
    toolPath = process.env[toolPath] || toolPath;
    let cmd: string = `${toolPath} --message-output-file: ${srcPath}`;

    exec(cmd, (error, stdout, stderr) => {
      let diagOutput:string|null = null;

      if (stderr) {
        // TODO diagnose analyzer execution failure
      }
      else if (error && !stdout) {
        // TODO diagnose different errorlevels
      }
      else {
        diagOutput = stdout;
      }

      processDiagOutput(diagOutput, document);
    });
  }
}
