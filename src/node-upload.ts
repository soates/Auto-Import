import { ImportDb } from './import-db';
import * as FS from 'fs';
import * as vscode from 'vscode';
import * as _ from 'lodash';

export class NodeUpload {

    private filesToScan: string;

    private useAutoImportNet: boolean;


    constructor(private config: vscode.WorkspaceConfiguration) {
        this.filesToScan = this.config.get<string>('filesToScan');
        this.useAutoImportNet = this.config.get<boolean>('useAutoImportNet');
    }

    public scanNodeModules() {
        this.getMappings().then((mappings) => {

            for (let key in mappings.mappings) {
                let map = mappings.mappings[key];
                if (map) {
                    map.forEach(exp => {
                        ImportDb.saveImport(exp, exp, { fsPath: key, discovered: true }, mappings.workspace)
                    });
                }
            }

        });
    }

    public getMappings(): Promise<any> {
        return new Promise<any>((resolve) => {

            let mappings: any = {}

            let mapArrayToLocation = (exports, location) => {
                if (mappings[location]) {
                    mappings[location] = (mappings[location]).concat(exports);
                } else {
                    mappings[location] = exports;
                }
            };

            vscode.workspace.workspaceFolders.forEach(workspace => {

                let glob = vscode.workspace.getConfiguration('autoimport').get<string>('filesToScan');

                const relativePattern = new vscode.RelativePattern(workspace, glob);

                vscode.workspace.findFiles(relativePattern, '**/node_modules/**', 99999).then((files) => {
                    files.forEach((f, i) => {
                        FS.readFile(f.fsPath, 'utf8', (err, data) => {

                            if (err) {
                                return console.log(err);
                            }

                            let matches = data.match(/\bimport\s+(?:.+\s+from\s+)?[\'"]([^"\']+)["\']/g);

                            if (matches) {
                                matches.forEach(m => {
                                    if (m.indexOf('./') === -1 && m.indexOf('!') === -1) {
                                        let exports = m.match(/\bimport\s+(?:.+\s+from\s+)/),
                                            location = m.match(/[\'"]([^"\']+)["\']/g);

                                        if (exports && location) {
                                            let exportArray = exports[0]
                                                .replace('import', '')
                                                .replace('{', '')
                                                .replace('}', '')
                                                .replace('from', '')
                                                .split(',')
                                                .map(e => {
                                                    e = e.replace(/\s/g, ''); return e;
                                                })

                                            mapArrayToLocation(exportArray, location[0].replace("'", '')
                                                .replace("'", ""));
                                        }
                                    }
                                });
                            }

                            if (i == (files.length - 1)) {
                                for (let key in mappings) {
                                    if (mappings.hasOwnProperty(key)) {
                                        mappings[key] = _.uniq(mappings[key]);
                                    }
                                }
                                return resolve({ mappings, workspace });
                            }
                        });
                    });
                });

            });



        });
    }

}
