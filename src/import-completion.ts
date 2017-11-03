import { PathHelper } from './helpers/path-helper';
import { ImportDb, ImportObject } from './import-db';
import { ImportFixer } from './import-fixer';

import * as vscode from 'vscode';
import { workspace } from 'vscode';


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

            let workspace = vscode.workspace.getWorkspaceFolder(document.uri);

            let matcher = f => f.name.toLowerCase().indexOf(wordToComplete) > -1;

            if (workspace !== undefined) {
                matcher = f => f.name.toLowerCase().indexOf(wordToComplete) > -1 && f.workspace.name == workspace.name;
            }

            let found = ImportDb.all()
                .filter(matcher);

            return resolve(found.map(i => this.buildCompletionItem(i, document)));
        })
    }


    private buildCompletionItem(imp: ImportObject, document: vscode.TextDocument): any {

        let path = this.createDescription(imp, document);

        return {
            label: imp.name,
            kind: vscode.CompletionItemKind.Reference,
            detail: `[AI] import ${imp.name} (Auto-Import)`,
            documentation: `[AI]  Import ${imp.name} from ${path}`,
            command: { title: 'AI: Autocomplete', command: 'extension.resolveImport', arguments: [{ imp, document }] }
        }
    }

    private createDescription(imp: ImportObject, document: vscode.TextDocument) {
        let path = (imp: ImportObject) => {
            if ((<any>imp.file).discovered) {
                return imp.file.fsPath;
            } else {
                let rp = PathHelper.normalisePath(
                    PathHelper.getRelativePath(document.uri.fsPath, imp.file.fsPath));
                return rp;
            }
        };
        return path(imp);
    }
}