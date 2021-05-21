import * as vs from 'vscode';
import requestAst from './astStorage';

export default async function reloadSyntaxTree() {
  const editor = vs.window.activeTextEditor;
  if (!editor)
    return;

  const ast = await requestAst(editor.document);
  console.log("AST:", ast);
}