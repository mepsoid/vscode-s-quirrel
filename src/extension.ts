import * as vs from 'vscode';

import { SubstitutePathByFile } from './SubstitutePathByFile';
import openFileByPath from './openFileByPath';
import checkSyntaxOnSave from './checkSyntaxOnSave';

export function activate(context: vs.ExtensionContext) {
  const DOCUMENT: vs.DocumentSelector = { language: 'squirrel', scheme: 'file' };
  const completePath: vs.Disposable = vs.languages.registerCompletionItemProvider(
    DOCUMENT, new SubstitutePathByFile(), '"', '/', '\\');
  context.subscriptions.push(completePath);

  const commandOpenByPath: vs.Disposable = vs.commands.registerCommand(
    'squirrel.editor.action.revealDefinition', openFileByPath);
  context.subscriptions.push(commandOpenByPath);

  vs.workspace.onDidSaveTextDocument(checkSyntaxOnSave);
}

export function deactivate() {
  return undefined;
}