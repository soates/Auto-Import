import { NodeUpload } from './node-upload';
import { ImportAction } from './import-action';
import { ImportFixer } from './import-fixer';
import { ImportScanner } from './import-scanner';
import { ImportDb } from './import-db';
import { ImportCompletion } from './import-completion';

import * as vscode from 'vscode';

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

        let codeActionFixer = vscode.languages.registerCodeActionsProvider('typescript', new ImportAction())

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

        let completetion = vscode.languages.registerCompletionItemProvider('typescript', new ImportCompletion(this.context, vscode.workspace.getConfiguration('autoimport').get<boolean>('autoComplete')), '');

        AutoImport.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);

        AutoImport.statusBar.text = '{..} : Scanning.. ';

        AutoImport.statusBar.show();

        this.context.subscriptions.push(importScanner, importFixer, nodeScanner, codeActionFixer, AutoImport.statusBar, completetion);
    }

    public attachFileWatcher(): void {

        var multiWorkspace = vscode.workspace.workspaceFolders.length > 0;

        if (multiWorkspace === true) {
            
            vscode.workspace.workspaceFolders.forEach(workspace => {

                let glob = vscode.workspace.getConfiguration('autoimport').get<string>('filesToScan');

                const relativePattern = new vscode.RelativePattern(workspace, glob);

                let watcher = vscode.workspace.createFileSystemWatcher(relativePattern);

                watcher.onDidChange((file: vscode.Uri) => {
                    vscode.commands
                        .executeCommand('extension.importScan', { workspace, file, edit: true });
                })

                watcher.onDidCreate((file: vscode.Uri) => {
                    vscode.commands
                        .executeCommand('extension.importScan', { workspace, file, edit: true });
                })

                watcher.onDidDelete((file: vscode.Uri) => {
                    vscode.commands
                        .executeCommand('extension.importScan', { workspace, file, delete: true });
                })


            });

        } else {

            let glob = vscode.workspace.getConfiguration('autoimport').get<string>('filesToScan');

            let watcher = vscode.workspace.createFileSystemWatcher(glob);

            let workspace = undefined;

            watcher.onDidChange((file: vscode.Uri) => {
                vscode.commands
                    .executeCommand('extension.importScan', { workspace, file, edit: true });
            })

            watcher.onDidCreate((file: vscode.Uri) => {
                vscode.commands
                    .executeCommand('extension.importScan', { workspace, file, edit: true });
            })

            watcher.onDidDelete((file: vscode.Uri) => {
                vscode.commands
                    .executeCommand('extension.importScan', { workspace, file, delete: true });
            })
        }


    }

    public scanIfRequired(): void {

        let settings = this.context.workspaceState.get<any>('auto-import-settings')

        let firstRun = (settings === undefined || settings.firstRun);

        if (vscode.workspace.getConfiguration('autoimport').get<boolean>('showNotifications')) {
            vscode.window
                .showInformationMessage('[AutoImport] Building cache');
        }

        var multiWorkspace = vscode.workspace.workspaceFolders.length > 0;

        if (multiWorkspace === true) {

            vscode.workspace.workspaceFolders.forEach(workspace => {

                vscode.commands
                    .executeCommand('extension.importScan', { workspace, showOutput: true });

            });
        } else {

            vscode.commands
                .executeCommand('extension.importScan', { showOutput: true });
        }


        settings.firstRun = true;

        this.context.workspaceState.update('auto-import-settings', settings);
    }

    public static setStatusBar() {
        AutoImport.statusBar.text = `{..} : ${ImportDb.count}`;
    }
}