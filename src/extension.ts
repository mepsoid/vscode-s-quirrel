import * as vs from 'vscode';

import { SubstitutePathByFile } from './SubstitutePathByFile';
import openFileByPath from './openFileByPath';
import runDocumentCode from './runDocumentCode';
import checkSyntaxOnSave from './checkSyntaxOnSave';
import clearDiagsOnClose from './clearDiagsOnClose';

export function activate(context: vs.ExtensionContext) {
  const DOCUMENT: vs.DocumentSelector = { language: 'squirrel', scheme: 'file' };
  const completePath: vs.Disposable = vs.languages.registerCompletionItemProvider(
    DOCUMENT, new SubstitutePathByFile(), '"', '/', '\\');
  context.subscriptions.push(completePath);

  const commandOpenByPath: vs.Disposable = vs.commands.registerCommand(
    'squirrel.editor.action.openModule', openFileByPath);
  context.subscriptions.push(commandOpenByPath);

  const commandRunDocumentCode: vs.Disposable = vs.commands.registerCommand(
    'squirrel.editor.action.runCode', runDocumentCode);
  context.subscriptions.push(commandRunDocumentCode);

  vs.workspace.onDidSaveTextDocument(checkSyntaxOnSave);
  vs.workspace.onDidCloseTextDocument(clearDiagsOnClose);
}

export function deactivate() {
  return undefined;
}