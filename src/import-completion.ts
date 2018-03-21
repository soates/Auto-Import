import { PathHelper } from './helpers/path-helper';
import { ImportDb, ImportObject } from './import-db';
import { ImportFixer } from './import-fixer';

import * as vscode from 'vscode';


export class ImportCompletion implements vscode.CompletionItemProvider {

    constructor(private context: vscode.ExtensionContext, private enabled: boolean) {
        let fixer = vscode.commands.registerCommand('extension.resolveImport', (args) => {
            new ImportFixer().fix(args.document, undefined, undefined, undefined, [args.imp]);
        });

        context.subscriptions.push(fixer);
    }

    public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position,
        token: vscode.CancellationToken): Promise<vscode.CompletionItem[]> {

        if (!this.enabled) {
            return Promise.resolve([]);
        }

        return new Promise((resolve, reject) => {

            let wordToComplete = '';

            let range = document.getWordRangeAtPosition(position);

            if (range) {
                wordToComplete = document.getText(new vscode.Range(range.start, position)).toLowerCase();
            }

            return resolve(ImportDb.all()
                .filter(f => {
                    return f.name.toLowerCase().indexOf(wordToComplete) > -1
                })
                .map(i => this.buildCompletionItem(i, document))
            );
        })
    }


    private buildCompletionItem(imp: ImportObject, document: vscode.TextDocument): any {
        return {
            label: imp.name,
            kind: vscode.CompletionItemKind.Reference,
            detail: `import from ${imp.getPath(document)}`,
            documentation: `Import ${imp.name} from ${imp.getPath(document)}`,
            command: { title: 'AI: Autocomplete', command: 'extension.resolveImport', arguments: [{ imp, document }] }
        }
    }
}
