import * as vscode from 'vscode';

import { ImportAction } from './import-action';
import { ImportCompletion } from './import-completion';
import { ImportDb } from './import-db';
import { ImportFixer } from './import-fixer';
import { ImportScanner } from './import-scanner';
import { NodeUpload } from './node-upload';

export class AutoImport {

    public static statusBar;

    constructor(private context: vscode.ExtensionContext) { }

    public start(): boolean {

        let folder = vscode.workspace.rootPath;

        if (folder === undefined) {
            return false;
        }

        return true;
    }

    public attachCommands(): void {

        let codeActionFixer = vscode.languages.registerCodeActionsProvider(['javascript', 'javascriptreact', 'typescript', 'typescriptreact'], new ImportAction())

        let importScanner = vscode.commands.registerCommand('extension.importScan', (request: any) => {

            let scanner = new ImportScanner(vscode.workspace.getConfiguration('autoimport'))

            if (request.showOutput) {
                scanner.scan(request);
            } else if (request.edit) {
                scanner.edit(request);
            }
            else if (request.delete) {
                scanner.delete(request);
            }
        });

        let nodeScanner = vscode.commands.registerCommand('extension.scanNodeModules', () => {
            new NodeUpload(vscode.workspace.getConfiguration('autoimport')).scanNodeModules();
        });

        let importFixer = vscode.commands.registerCommand('extension.fixImport', (d, r, c, t, i) => {
            new ImportFixer().fix(d, r, c, t, i);
        });

        let completetion = vscode.languages.registerCompletionItemProvider(['javascript', 'javascriptreact', 'typescript', 'typescriptreact'], new ImportCompletion(this.context, vscode.workspace.getConfiguration('autoimport').get<boolean>('autoComplete')), '');

        AutoImport.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);

        AutoImport.statusBar.text = '{..} : Scanning.. ';

        AutoImport.statusBar.show();

        this.context.subscriptions.push(importScanner, importFixer, nodeScanner, codeActionFixer, AutoImport.statusBar, completetion);
    }

    public attachFileWatcher(): void {

        let glob = vscode.workspace.getConfiguration('autoimport').get<string>('filesToScan');

        let watcher = vscode.workspace.createFileSystemWatcher(glob);

        watcher.onDidChange((file: vscode.Uri) => {
            vscode.commands
                .executeCommand('extension.importScan', { file, edit: true });
        })

        watcher.onDidCreate((file: vscode.Uri) => {
            vscode.commands
                .executeCommand('extension.importScan', { file, edit: true });
        })

        watcher.onDidDelete((file: vscode.Uri) => {
            vscode.commands
                .executeCommand('extension.importScan', { file, delete: true });
        })

    }

    public scanIfRequired(): void {
        let settings = this.context.workspaceState.get<any>('auto-import-settings')

        let firstRun = (settings === undefined || settings.firstRun);

        if (vscode.workspace.getConfiguration('autoimport').get<boolean>('showNotifications')) {
            vscode.window
                .showInformationMessage('[AutoImport] Building cache');
        }

        vscode.commands
            .executeCommand('extension.importScan', { showOutput: true });

        settings.firstRun = true;

        this.context.workspaceState.update('auto-import-settings', settings);
    }

    public static setStatusBar() {
        AutoImport.statusBar.text = `{..} : ${ImportDb.count}`;
    }
}