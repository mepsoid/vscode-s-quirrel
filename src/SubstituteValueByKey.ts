import * as vs from 'vscode';
import { promises as fs } from 'fs';
import { extractKeyBefore } from './utils';
import { mapKeyValue, KeyDescriptor } from './mapKeyValue';

export class SubstituteValueByKey implements vs.CompletionItemProvider {

  provideCompletionItems(
    document: vs.TextDocument, position: vs.Position,
    token: vs.CancellationToken, context: vs.CompletionContext
  ) {
    const line = document.lineAt(position).text;
    const key = extractKeyBefore(line, position.character);
    if (key == null)
      return undefined;

    let values = mapKeyValue[key.value];
    let alias;
    while ((alias = (values as KeyDescriptor).alias) != undefined)
      values = mapKeyValue[alias];
    if (values == null)
      return undefined;

    const range = new vs.Range(position.line, position.character, position.line, position.character);
    const valuesList: string[] = typeof values === "string" ? [values] : (values as string[]);
    const result: vs.CompletionItem[] = valuesList.map((value) => {
      const item =  new vs.CompletionItem(value);
      item.kind = vs.CompletionItemKind.Value;
      item.insertText = `${key.delimiter}${value}`;
      item.range = range;
      return item;
    });
    return result;
  }

}