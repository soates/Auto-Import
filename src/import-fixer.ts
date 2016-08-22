import * as vscode from 'vscode'
import * as path from 'path';

import { ImportObject } from './import-db';

export class ImportFixer {

    private spacesBetweenBraces;
    private doubleQuotes;

    constructor() {
        let config = vscode.workspace.getConfiguration('autoimport');

        this.spacesBetweenBraces = config.get<boolean>('spaceBetweenBraces');
        this.doubleQuotes = config.get<boolean>('doubleQuotes');
    }

    public fix(document: vscode.TextDocument, range: vscode.Range,
        context: vscode.CodeActionContext, token: vscode.CancellationToken, imports: Array<ImportObject>): void {

        let edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
        let importObj: vscode.Uri | any = imports[0].file;
        let importName: string = imports[0].name;

        let relativePath = this.normaliseRelativePath(importObj, this.getRelativePath(document, importObj));

        if (this.shouldMergeImport(document, relativePath)) {
            edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0),
                this.mergeImports(document, edit, importName, importObj, relativePath));
        } else {
            edit.insert(document.uri, new vscode.Position(0, 0),
                this.createImportStatement(imports[0].name, relativePath, true));
        }

        vscode.workspace.applyEdit(edit);
    }

    private shouldMergeImport(document: vscode.TextDocument, relativePath): boolean {
        return document.getText().indexOf(relativePath) !== -1;
    }

    private mergeImports(document: vscode.TextDocument, edit: vscode.WorkspaceEdit, name, file, relativePath: string) {

        let exp = new RegExp('(?:import\ \{)(?:.*)(?:\}\ from\ \')(?:' + relativePath + ')(?:\'\;)')

        let currentDoc = document.getText();

        let foundImport = currentDoc.match(exp)

        if (foundImport) {
            let workingString = foundImport[0];

            workingString = workingString
                .replace(/{|}|from|import|'|"| |;/gi, '').replace(relativePath, '');

            let importArray = workingString.split(',');

            importArray.push(name)

            let newImport = this.createImportStatement(importArray.join(', '), relativePath);

            currentDoc = currentDoc.replace(exp, newImport);
        }

        return currentDoc;
    }

    private createImportStatement(imp: string, path: string, endline: boolean = false): string {
        let baseString = `import { ${imp} } from '${path}';${endline ? '\r\n' : ''}`;

        if (this.doubleQuotes) {
            baseString = baseString.replace(/'/gi, "\"");
        }

        if (!this.spacesBetweenBraces) {
            baseString = baseString.replace('{ ', '{').replace(' }', '}');
        }

        return baseString;
    }

    private getRelativePath(document, importObj: vscode.Uri | any): string {
        return importObj.discovered ? importObj.fsPath :
            path.relative(path.dirname(document.fileName), importObj.fsPath);
    }

    private normaliseRelativePath(importObj, relativePath: string): string {

        let removeFileExtenion = (rp) => {
            if (rp) {
                rp = rp.substring(0, rp.lastIndexOf('.'))
            }
            return rp;
        }

        let makeRelativePath = (rp) => {

            let preAppend = /^win/.test(process.platform) ? '.\\' : './';

            if (!rp.startsWith(preAppend)) {
                rp = preAppend + rp;
            }

            return rp;
        }

        if (importObj.discovered === undefined) {
            relativePath = makeRelativePath(relativePath);
            relativePath = removeFileExtenion(relativePath);
        }

        return relativePath;
    }
}