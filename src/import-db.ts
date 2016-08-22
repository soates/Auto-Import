var JsonDB = require('node-json-db');

import * as Path from 'path';
import * as vscode from 'vscode';

export interface ImportObject {
    name: string,
    file: vscode.Uri
}

export class ImportDb {


    public getDB(): any {
        return new JsonDB(Path.join(__dirname, `import-${this.dbName()}.json`), true, true);
    }

    public dbName(): number {
        return vscode.workspace.rootPath.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    }

    public getImport(name: string): Array<ImportObject> {
        let db = this.getDB();

        return db.getData('/imports/' + name);
    }

    public delete(request: any): void {
        let db = this.getDB();

        let map = db.getData(`/mapping/${request.file.fsPath.replace(/\//g, '-')}`)

        map.forEach(m => {
            db.delete(m.location)
        });
    }

    public saveImport(name: string, data: any, file: any): void {

        name = name.trim();

        if (name === '' || name.length === 1) {
            return;
        }

        let db = this.getDB();

        let obj: ImportObject = {
            name,
            file
        }
        db.push(`/imports/${name}`, [obj], true);
        db.push(`/mapping/${file.fsPath.replace(/\//g, '-')}`, [{ location: `/imports/${name}` }], true);
    }
}