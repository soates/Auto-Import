import { NodeUpload } from './node-upload';
import * as FS from 'fs';
import * as vscode from 'vscode';
import * as _ from 'lodash';

import { ImportDb } from './import-db';
import { AutoImport } from './auto-import';

export class ImportScanner {

    private scanStarted: Date;

    private scanEnded: Date;

    private showOutput: boolean;

    private filesToScan: string;

    private showNotifications: boolean;

    constructor(private config: vscode.WorkspaceConfiguration) {
        this.filesToScan = this.config.get<string>('filesToScan');
        this.showNotifications = this.config.get<boolean>('showNotifications');
    }

    public scan(request: any): void {

        this.showOutput = request.showOutput ? request.showOutput : false;

        if (this.showOutput) {
            this.scanStarted = new Date();
        }

        vscode.workspace
            .findFiles(this.filesToScan, '**/node_modules/**', 99999)
            .then((files) => this.processWorkspaceFiles(files));

        vscode.commands
            .executeCommand('extension.scanNodeModules');

    }

    public edit(request: any): void {
        ImportDb.delete(request);
        this.loadFile(request.file, true);
        new NodeUpload(vscode.workspace.getConfiguration('autoimport')).scanNodeModules();

    }

    public delete(request: any): void {
        ImportDb.delete(request);
        AutoImport.setStatusBar();
    }


    private processWorkspaceFiles(files: vscode.Uri[]): void {
        let pruned = files.filter((f) => {
            return f.fsPath.indexOf('typings') === -1 &&
                f.fsPath.indexOf('node_modules') === -1 &&
                f.fsPath.indexOf('.history') === -1 &&
                f.fsPath.indexOf('jspm_packages') === -1;
        });

        pruned.forEach((f, i) => {
            this.loadFile(f, i === (pruned.length - 1));
        });
    }

    private loadFile(file: vscode.Uri, last: boolean): void {
        FS.readFile(file.fsPath, 'utf8', (err, data) => {

            if (err) {
                return console.log(err);
            }

            this.processFile(data, file);

            if (last) {
                AutoImport.setStatusBar();
            }

            if (last && this.showOutput && this.showNotifications) {
                this.scanEnded = new Date();

                let str = `[AutoImport] cache creation complete - (${Math.abs(<any>this.scanStarted - <any>this.scanEnded)}ms)`;

                vscode.window
                    .showInformationMessage(str);
            }

        });
    }

    private processFile(data: any, file: vscode.Uri): void {
        const regExp = /(export\s?(default)?\s?(class|interface|let|var|const|function)?) ([a-zA-z])\w+/g;
        var matches = data.match(regExp);

        if (matches != null) {
            matches.forEach(m => {
                const mArr = m.split(/\s/);
                const workingFile: string = mArr[mArr.length - 1];
                const isDefault = m.indexOf('default') !== -1;
                ImportDb.saveImport(workingFile, data, file, isDefault);
            })
        }
    }
}