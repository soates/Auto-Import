
import * as Path from 'path';
import * as vscode from 'vscode';

export interface ImportObject {
    name: string,
    file: vscode.Uri
}


export class ImportDb {

    private static imports: Array<ImportObject> = new Array<ImportObject>();

    public static get count() {

        return ImportDb.imports.length;
    }

    public static all(): Array<ImportObject> {
        return ImportDb.imports;
    }

    public static getImport(name: string): Array<ImportObject> {
        return ImportDb.imports.filter(i => i.name === name);
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

    public static saveImport(name: string, data: any, file: any): void {

        name = name.trim();

        if (name === '' || name.length === 1) {
            return;
        }


        let obj: ImportObject = {
            name,
            file
        }

        let exists = ImportDb.imports.findIndex(m => m.name === obj.name && m.file.fsPath === file.fsPath);

        if (exists === -1) {
            ImportDb.imports.push(obj);
        }

    }
}