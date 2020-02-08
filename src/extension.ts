import * as vs from 'vscode';
import openFileByPath from './openFileByPath';

export function activate(context: vs.ExtensionContext) {
  const commandOpenByPath: vs.Disposable = vs.commands.registerCommand(
    'squirrel.editor.action.revealDefinition', openFileByPath);
  context.subscriptions.push(commandOpenByPath);
}

export function deactivate() {
}