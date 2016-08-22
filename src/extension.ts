
import * as vscode from 'vscode';

import { AutoImport } from './auto-import';

export function activate(context: vscode.ExtensionContext) {

    if (context.workspaceState.get('auto-import-settings') === undefined) {
        context.workspaceState.update('auto-import-settings', {});
    }

    let extension = new AutoImport(context);

    let start = extension.start();

    if (!start) {
        return;
    }

    extension.attachCommands();

    extension.attachFileWatcher();

    extension.scanIfRequired();
}

export function deactivate() {

}