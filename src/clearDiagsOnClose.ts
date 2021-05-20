import * as vs from 'vscode';
import syntaxDiags from './syntaxDiags';

export default function clearDiagsOnClose(document: vs.TextDocument) {
  if (document.languageId !== 'squirrel')
    return;

  syntaxDiags.delete(document.uri);
}