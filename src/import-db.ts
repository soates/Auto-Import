
import * as Path from 'path';
import * as vscode from 'vscode';

export interface ImportObject {
    name: string,
    file: vscode.Uri,
    workspace: vscode.WorkspaceFolder
}


export class ImportDb {

    private static imports: Array<ImportObject> = new Array<ImportObject>();

    public static get count() {

        return ImportDb.imports.length;
    }

    public static all(): Array<ImportObject> {
        return ImportDb.imports;
    }

    public static getImport(name: string, doc: vscode.Uri): Array<ImportObject> {

        let workspace = vscode.workspace.getWorkspaceFolder(doc);

        let matcher = (i: ImportObject) => i.name === name;

        if (workspace !== undefined) {
            matcher = (i: ImportObject) => i.name === name && i.workspace.name === workspace.name;
        }

        return ImportDb.imports.filter(matcher);
    }

    public static delete(request: any): void {

        try {

            let index = ImportDb.imports.findIndex(m => m.file.fsPath === request.file.fsPath);

            if (index !== -1) {
                ImportDb.imports.splice(index, 1);
            }

        } catch (error) {

        }

    }

    public static saveImport(name: string, data: any, file: any, workspace: vscode.WorkspaceFolder): void {

        name = name.trim();

        if (name === '' || name.length === 1) {
            return;
        }


        let obj: ImportObject = {
            name,
            file,
            workspace
        }

        let exists = ImportDb.imports.findIndex(m => m.name === obj.name && m.file.fsPath === file.fsPath);

        if (exists === -1) {
            ImportDb.imports.push(obj);
        }

    }
}